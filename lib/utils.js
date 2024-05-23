const { spec, request } = require('pactum');
const { faker } = require('@faker-js/faker');

const baseUrl = "https://practice.expandtesting.com/notes/api"

async function userLogin(email, password) {
    const loginResponse = await spec().post(`${baseUrl}/users/login`)
    .withBody({
        "email": email,
        "password": password
    })
    .expectStatus(200);

    return loginResponse.body.data.token;
}

async function createNote(tokenId) {

    const title = faker.music.songName();
    const description = faker.music.genre();

    const requestCreateNote = {
       "title": title,
        "description": description,
        "category": "Home"
    }

    const newNote = await spec().post(`${baseUrl}/notes`)
    .withHeaders("x-auth-token", tokenId)
    .withBody(requestCreateNote)
    .expectStatus(200);

    return newNote.body.data.id;
}

module.exports = {
    userLogin,createNote
}



