import os
from typing import AsyncGenerator, Dict, Any, Iterable, Optional

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:  # pragma: no cover - local fallback
    def load_dotenv():
        return None
try:
    from langchain.schema import SystemMessage, HumanMessage  # type: ignore
except ModuleNotFoundError:  # pragma: no cover - lightweight fallback
    class _BaseMessage:
        def __init__(self, content: str):
            self.content = content

    class SystemMessage(_BaseMessage):
        pass

    class HumanMessage(_BaseMessage):
        pass

try:
    from langchain_openai import ChatOpenAI  # type: ignore
except ModuleNotFoundError:  # pragma: no cover
    class ChatOpenAI:  # type: ignore
        def __init__(self, *args, **kwargs):
            raise RuntimeError("ChatOpenAI is unavailable; install langchain_openai")

load_dotenv()


def _get_temperature(default: float = 0.3) -> float:
    try:
        return float(os.getenv("CHATBOT_TEMPERATURE", default))
    except (TypeError, ValueError):
        return default


def _build_messages(query: str, extra_context: Optional[Iterable[str]] = None):
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    if extra_context:
        for context in extra_context:
            if context:
                messages.append(SystemMessage(content=context))
    messages.append(HumanMessage(content=query))
    return messages


def build_chat_model(streaming: bool = True) -> ChatOpenAI:
    model_name = os.getenv("CHATBOT_MODEL_NAME", "gpt-4")
    return ChatOpenAI(
        model_name=model_name,
        temperature=_get_temperature(),
        streaming=streaming,
    )


SYSTEM_PROMPT = (
    """
너는 FoodBiz AI 상담 비서야. 서비스 내부 데이터가 없어도 사용자의 질문을 정확히 이해하고, 
소상공인 운영과 금융에 도움이 되는 현실적인 조언을 한국어로 제공해.

- 모르면 아는 범위에서 답하고, 추가 정보가 필요하면 먼저 질문해.
- 확인된 사실과 근거를 분명하게 말하고, 실행 가능한 다음 단계를 제안해.
- 과장된 표현이나 홍보 문구는 피하고, 차분하고 신뢰감 있게 대답해.
"""
    .strip()
)


async def stream_chat_response(
    query: str,
    *,
    extra_context: Optional[Iterable[str]] = None,
) -> AsyncGenerator[Dict[str, Any], None]:
    """Stream tokens from the base chat model without RAG retrieval."""
    full_response = ""
    llm = build_chat_model(streaming=True)

    try:
        async for chunk in llm.astream(_build_messages(query, extra_context)):
            content = getattr(chunk, "content", None)
            if not content:
                continue
            full_response += content
            yield {"type": "chunk", "content": content}

        if not full_response.strip():
            fallback_text = await _generate_fallback_response(query, extra_context)
            yield {"type": "final", "response": fallback_text, "sources": []}
            return

        yield {"type": "final", "response": full_response, "sources": []}

    except Exception as error:
        print(f"Chat generation failed, switching to fallback model: {error}")
        fallback_text = await _generate_fallback_response(query, extra_context)
        yield {"type": "final", "response": fallback_text, "sources": []}


async def _generate_fallback_response(
    query: str,
    extra_context: Optional[Iterable[str]] = None,
) -> str:
    fallback_llm = build_chat_model(streaming=False)
    ai_message = await fallback_llm.ainvoke(_build_messages(query, extra_context))
    return getattr(ai_message, "content", str(ai_message))
