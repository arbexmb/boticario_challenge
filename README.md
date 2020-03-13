# Grupo Boticário - Backend Challenge

This repository contains an application design for the requested project in the Grupo Boticário - Backend Challenge.

## Introduction

The application was developed using JavaScript/Node.js as the programming language, and Express as the main development framework. As requested, a REST API was created, and its functionalities include everything that was asked for in the challenge, as well as the optional features, like unit and feature testes, and the application logs.

Besides that, and also to make the test easier to correct, I have set up Docker containers in the application infrastructure, making the building process easier. As you can see on the docker-compose.yml file, the application contains two services: one for the application itself, and one for a MongoDB database, in addition to a custom Docker network, binding them together.

## Setup

Since I have used Docker to mount the application's infrasctrucure, it is really easy to set up the project. You will only need `docker` and `docker-compose` installed in your local OS.

With that said, to run the application, you can simply clone this repository and run a couple of docker commands:

```
# docker-compose build
# docker-compose up -d
```

That's it!

The above commands will build the application on a development environment (and all of its dependencies), and then they will run it on port 3000.

## Running the test suite

As requested, I have developed unit and integration test suites, using **jest**, to ensure the application runs smoothly. With the containers up, run the tests by using the following command:

```
# docker-compose exec development yarn test
```

There are plenty of tests, as you will see. I have even used supertest's agent to test the API functionalities while persisting session between requests.

Everything should pass!

## Testing the API endpoints

I have set 12 endpoints in the application. I will list each of them below. Feel free to use your favourite REST client to test them:

#### 1. Create Retailer

- POST: http://127.0.0.1:3000/retailers

Firstly, it is necessary to create a retailer, in order to use any of the next API's functionalities. There is an example dummy data below, showing a valid retailer object which can be send via the request body.

```json
{
  "name": "José Silva",
  "cpf": "890.062.030-41",
  "email": "josesilva@email.com",
  "password": "password"
}
```

**OBS:** The object above will be used as dummy data on the next requests, when necessary.

#### 2. Getting all Retailers

- GET: http://127.0.0.1:3000/retailers

It is possible to fetch all of the retailers saved on our database by sending the GET request above. The response is an array of retailer's object.

#### 3. Getting Retailer through its CPF

- GET: http://127.0.0.1:3000/retailers/89006203041

A single retailer can be fetched by passing its CPF as a parameter on the GET request above.

#### 4. Login

- POST: http://127.0.0.1:3000/retailers/login

To log in to the application, the POST request above can be used by sending a saved retailer through its body.

```json
{
  "cpf": "890.062.030-41",
  "password": "password"
}
```

Once you login, you will be able to test the API's functionalities which are restricted to logged in retailers, described on steps 5, 6, 7 and 8.

#### 5. Store Logged In Retailer Purchase

- POST: http://127.0.0.1:3000/purchases

After logging in, the only thing you will need to send in order to store a purchase and attach it to the logged retailer, is the value of the purchase.

```json
{
  "value": 240
}
```

The above request body is all you need to store a purchase and attach it to the logged in retailer. The relationship is set by using the session properties.

**OBS:** As requested, each purchase generates a cashback value. I have created a logic to handle the cashback amount for each purchase using the specified criterias set on the challenge.

**OBS 2:** I have also created an endpoint in which it is possible to store a purchase without being logged in, only by passing the CPF of the retailer who made it. You can check it on step 9.

#### 6. Get Logged In Retailer Purchases

- GET: http://127.0.0.1:3000/retailers/purchases

Use the above endpoint to check the purchases attached to the logged in retailer. The response is an array of purchase's objects.

**OBS:** This action can also be done without being logged in. Check step 10.

#### 7. Get Logged In Retailer Total Cashback

- GET: http://127.0.0.1:3000/retailers/cashback

This endpoint returns the total cashback of the logged in retailer.

**IMPORTANT:** Note that this route returns the **total cashback**. The cashback for each purchase is stored on each purchase object.

**OBS:** This action can also be done without being logged in. Check step 11.

#### 8. Logout

- GET: http://127.0.0.1:3000/retailers/logout

To logout, just send the GET request above. It will nullify the retailer session object.

#### 9. Store Purchase by Retailer CPF

- POST: http://127.0.0.1:3000/purchases/89006203041

As mentioned on step 5, I have developed an endpoint to store a purchase without being logged in, by sending a specified retailer CPF as a parameter. The request body is the same as step 5.

```json
{
  "value": 1270
}
```
#### 10. Get Purchases by Retailer CPF

- GET: http://127.0.0.1:3000/purchases/89006203041

Send the above GET request to fetch the purchases of a specific retailer, by passing its CPF as a parameter. It is not necessary to be logged in.

#### 11. Get Total Cashback by Retailer CPF

- GET: http://127.0.0.1:3000/retailers/cashback/89006203041

In addition to check the retailer cashback when logged in, it is possible to use the endpoint above to GET the total cashback of a retailer through its CPF. It is not necessary to be logged in.

#### 12. Get Cashback Through External API

- GET: http://127.0.0.1:3000/retailers/cashback-api/89006203041

As requested, I have developed an endpoint to consume the external API provided by Boticário. The route above makes a request to the url provided on the challenge and returns the parsed response body back to the local application.

## Application logs

Last, but not least: the application logs.

I have set the application logs using **winston**. There are a couple of commands you can use in order to check them.

If you wish to audit them live, while testing the application, run the following:

```
# docker-compose exec development tail -f src/logs/app.log
```

However, if you wish to check the logs after testing the API, without live interaction, run the following:

```
# docker-compose exec development cat src/logs/app.log
```

## Observation

Please, note that the docker commands mentioned above must be run as root. And, also, ports 3000 and 27018 must be free in order to properly run the application and database containers.

## Conclusion

As requested, the API in this repository provides a way to create retailers, purchases, fetch them both, bind them together, and handle each retailer's purchase cashback. I have tried my best to cover it with unit and integration tests, as well as make it easy to correct, by setting Docker containers on its infrastructure. Of course, there are a lot of tests, functionalities, and validations which I was not able to cover in the time I had to develop the application, however I hope what I did is enough to show my skills.

