const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../src/db");
const { createCharacter } = require("../../src/controllers/characters");

describe("create", () => {
  beforeEach(() => {
    sinon.restore();
  });
  it("returns a 201 status code", async () => {
    // arrange
    // checkStatus function would normally get request and response object from express framework
    // but because we are unit testing we need to supply this and it needs to have the same "shape"
    // as what it would in the function
    const request = { body: { name: "name", ship: "ship", rank: "rank" } };
    const response = {};
    // create fake status method that returns the response so we can chain on .json
    response.status = sinon.stub().returns(response);
    // then setting .json to a spy so can run assertions on it
    response.json = sinon.spy();
    // creating data variable to mimic what would be returned from database
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
    // using sinon.stub method, pass it the database object, tell to replace query method on that object (the await db.query() from the controller)
    // then tell it what to return, as it's an async function it needs to return promise which resolves to the data above
    sinon.stub(db, "query").returns(Promise.resolve(data));

    // act
    // run function with everything created above
    await createCharacter(request, response);

    // assert
    // using spy set on line 20 to assert the method .status has been called with 201
    expect(response.status.calledWith(201)).to.be.true;
    // using spy set on line 20 to assert the method .json has been called with the correct arguements
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
    // mock combines spy and stub
    const mockDB = sinon
      .mock(db) // mock the db object i.e. automatically replace this object and all of it's methods
      .expects("query") // chain expectations on query method so can see mock is being used as expected
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
