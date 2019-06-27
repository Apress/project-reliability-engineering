import asyncio

async def print_later(time, text):
  await asyncio.sleep(time)
  print(text)

async def main():
  print("started")
  task1 = asyncio.ensure_future(
    print_later(2, '2 seconds'))
  task2 = asyncio.ensure_future(
    print_later(1, '1 seconds'))
  await task1
  await task2

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
