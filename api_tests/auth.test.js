const { spec, request } = require("pactum");
const { userLogin } = require("../lib/utils");
const { createNote } = require("../lib/utils");
const getNotes = require("../data/get-notes-schema.json");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com";

describe("auth test suite", () => {
  let tokenId = "";

  beforeEach(async () => {
    request.setDefaultTimeout(60000);

    tokenId = await userLogin("valig90@gmail.com", "AlaBalaPortocala");
  });

  it("user register", async () => {
    const randomEmail = faker.internet.email();
    const randomFirstName = faker.person.firstName();

    const requestBody = {
      name: randomFirstName + " Georgescu",
      email: randomEmail,
      password: "AlaBalaPortocala",
    };
    await spec()
      .post(`${baseUrl}/notes/api/users/register`)
      .withBody(requestBody)
      .expectStatus(201);
  });

  it("user invalid register", async () => {
    const requestBodyInvalid = {
      email: "valiG90@gmail.com",
      password: "AlaBalaPortocala",
    };
    await spec()
      .post(`${baseUrl}/notes/api/users/register`)
      .withBody(requestBodyInvalid)
      .expectStatus(400)
      .expectBodyContains("User name must be between 4 and 30 characters");
  });

  it("user create note", async () => {
    const title = faker.music.songName();
    const description = faker.music.genre();

    const requestCreateNote = {
      title: title,
      description: description,
      category: "Home",
    };

    await spec()
      .post(`${baseUrl}/notes/api/notes`)
      .withHeaders("x-auth-token", tokenId)
      .withBody(requestCreateNote)
      .expectStatus(200);
  });

  it("get all notes", async () => {
    await spec()
      .get(`${baseUrl}/notes/api/notes`)
      .withHeaders("x-auth-token", tokenId)
      .expectStatus(200)
      .expectJsonSchema(getNotes);
  });

  it("delete note", async () => {
    const noteId = await createNote(tokenId);

    await spec()
      .delete(`${baseUrl}/notes/api/notes/${noteId}`)
      .withHeaders("x-auth-token", tokenId)
      .expectStatus(200);
  });
});
