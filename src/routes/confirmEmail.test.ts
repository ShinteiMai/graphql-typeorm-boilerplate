import fetch from "node-fetch";

test("sends invalid back if bad id was sent", async () => {
  const response = await fetch(
    `${process.env.TEST_HOST as string}/confirm/1202139`
  );
  const text = await response.text();
  expect(text).toEqual("invalid user");
});
