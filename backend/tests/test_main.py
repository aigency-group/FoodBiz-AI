import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from services import rag_service


class DummyLLM:
    def __init__(self, chunks):
        self._chunks = chunks

    async def astream(self, _messages):
        for chunk in self._chunks:
            yield chunk

    async def ainvoke(self, _messages):
        return SimpleNamespace(content="fallback")


def _run(coro):
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


def test_stream_chat_response_yields_chunks():
    chunks = [SimpleNamespace(content="Hello"), SimpleNamespace(content=" World")]

    with patch("services.rag_service._build_chat_model", return_value=DummyLLM(chunks)):
        async def _collect():
            collected = []
            async for item in rag_service.stream_chat_response("hi"):
                collected.append(item)
            return collected

        outputs = _run(_collect())

    assert outputs[0] == {"type": "chunk", "content": "Hello"}
    assert outputs[1] == {"type": "chunk", "content": " World"}
    assert outputs[-1]["type"] == "final"
    assert outputs[-1]["response"] == "Hello World"
    assert outputs[-1]["sources"] == []


def test_stream_chat_response_uses_fallback_on_error():
    class FailingLLM:
        def astream(self, _messages):
            async def _gen():
                raise RuntimeError("network down")
                yield  # pragma: no cover

            return _gen()

        async def ainvoke(self, _messages):
            return SimpleNamespace(content="fallback text")

    with patch("services.rag_service._build_chat_model", return_value=FailingLLM()):
        async def _collect():
            collected = []
            async for item in rag_service.stream_chat_response("question"):
                collected.append(item)
            return collected

        outputs = _run(_collect())

    assert outputs[-1]["type"] == "final"
    assert outputs[-1]["response"] == "fallback text"
    assert outputs[-1]["sources"] == []


def test_stream_chat_response_handles_empty_generation():
    silent_llm = DummyLLM([])

    with patch("services.rag_service._build_chat_model", return_value=silent_llm), \
        patch("services.rag_service._generate_fallback_response", new=AsyncMock(return_value="empty")):
        async def _collect():
            collected = []
            async for item in rag_service.stream_chat_response("anything"):
                collected.append(item)
            return collected

        outputs = _run(_collect())

    assert outputs[-1]["response"] == "empty"
