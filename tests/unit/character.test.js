const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../src/db");
const { createCharacter } = require("../../src/controllers/characters");

describe("create", () => {
  beforeEach(() => {
    sinon.restore();
  })
  it("returns a 201 status code", async () => {
    // arrange
    // matches the shape of the request body
    const request = { body: { name: "name", ship: "ship", rank: "rank" } };
    const response = {};
    // create fake status method that returns the response to pass to .json
    response.status = sinon.stub().returns(response);
    response.json = sinon.spy();
    const data = {
      rows: [
        {
          id: 1,
          name: "name",
          ship: "ship",
          rank: "rank",
        },
      ],
    };
    sinon.stub(db, "query").returns(Promise.resolve(data));

    // act
    await createCharacter(request, response);

    // assert
    expect(response.status.calledWith(201)).to.be.true;
    expect(
      response.json.calledWith({
        id: 1,
        name: "name",
        ship: "ship",
        rank: "rank",
      })
    ).to.be.true;
  });

  it("passes the correct SQL to the db", async () => {
    // arrange
    const request = { body: { name: "name", ship: "ship", rank: "rank" } };
    const response = {};
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub();

    const data = {
      rows: [
        {
          id: 1,
          name: "name",
          ship: "ship",
          rank: "rank",
        },
      ],
    };

    const mockDB = sinon
      .mock(db)
      .expects("query")
      .once()
      .withArgs(
        "INSERT INTO Characters(name, ship, rank) VALUES ($1, $2, $3) RETURNING *",
        ["name", "ship", "rank"]
      )
      .returns(Promise.resolve(data));

    // act
    await createCharacter(request, response);

    // assert
    mockDB.verify();
  });
});
