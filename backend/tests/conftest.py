import pytest


@pytest.fixture
def async_loop():
    """Provide a clean event loop for async tests when needed."""
    import asyncio

    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
