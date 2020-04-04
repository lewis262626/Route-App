import * as handler from '../handler';

test('hello', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
  };

  await handler.hello(event, context, callback);
});
