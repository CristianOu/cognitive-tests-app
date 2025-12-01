// tests/register.test.ts
import { POST } from "@/app/api/register/route";

describe("POST /api/register", () => {
it("should return 400 for invalid input", async () => {
  const url = `${process.env.NODE_ENV === 'test' ? 'http://localhost:3000' : 'https://cognitive-tests-app.vercel.app'}/api/register`;
  console.log("✅ NODE_ENV:", process.env.NODE_ENV);
  
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({}),
  });
  const res = await POST(req);

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json).toHaveProperty("error");
});

  it("should return 201 for valid input", async () => {
    const id = crypto.randomUUID();
    const url = `${process.env.NODE_ENV === 'test' ? 'http://localhost:3000' : 'https://cognitive-tests-app.vercel.app'}/api/register`;
    console.log(url);
    const req = new Request(url, {
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
