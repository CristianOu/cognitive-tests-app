// tests/register.test.ts
import { POST } from "@/app/api/register/route";

describe("POST /api/register", () => {
it("should return 400 for invalid input", async () => {
  const req = new Request("https://cognitive-tests-app.vercel.app/api/register", {
    method: "POST",
    body: JSON.stringify({}),
  });
  const res = await POST(req);

  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty("error");
});

  it("should return 201 for valid input", async () => {
    const id = crypto.randomUUID();
    const req = new Request("https://cognitive-tests-app.vercel.app/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: `${id}@example.com`,
        password: "12345678",
        name: "Test User",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toHaveProperty("message", "User created");
  });
});
