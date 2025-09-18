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


def _build_chat_model(streaming: bool = True) -> ChatOpenAI:
    model_name = os.getenv("CHATBOT_MODEL_NAME", "gpt-4")
    return ChatOpenAI(
        model_name=model_name,
        temperature=_get_temperature(),
        streaming=streaming,
    )


SYSTEM_PROMPT = (
    """
너는 FoodBiz AI의 상생 금융 비서야. 내부 지식 그래프나 문서 검색 기능이 없어도, 
소상공인 경영 데이터를 이해하고 실무적으로 도움이 되는 답변을 한국어로 제공해야 해. 
가능하면 아래 배경 정보를 참고하고, 자료가 없으면 일반적인 모범 사례와 실행 단계를 중심으로 설명해.

[서비스 배경]
기존 금융 서비스는 표준화된 상품 중심이라 소상공인의 개별 상황을 반영하기 어렵고, 계좌·이체 위주 기능에 머무르는 한계가 있다. 
PFM도 개인 소비 패턴 분석에 초점이 맞춰져 사업체의 복잡한 재무 구조를 반영하지 못한다. 
이 때문에 소상공인은 금융사를 단순 자금 조달처로 인식하며 장기 파트너십 구축이 어렵다.

[기술 기회]
생성형 AI는 거래, 신용, 업종 데이터 등 구조화된 지식을 활용해 상황 맞춤 조언을 제공할 수 있다. 
국내에서는 규제 완화와 한국어 특화 LLM(하이퍼클로바, 카카오 칼로 등)로 인해 이러한 AI 기반 경영 파트너 서비스 구현 가능성이 높아졌다.

상황 파악을 위해 필요한 정보가 있으면 질문으로 되묻고, 근거를 언급하며, 실천 가능한 계획을 제시해.
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
    llm = _build_chat_model(streaming=True)

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
    fallback_llm = _build_chat_model(streaming=False)
    ai_message = await fallback_llm.ainvoke(_build_messages(query, extra_context))
    return getattr(ai_message, "content", str(ai_message))
