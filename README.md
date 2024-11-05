## Pennylane Challenge

### Introduction

This app uses React Native from the setup provided in the original repo, and made use of several dependencies that were already preinstalled:

- TanStack Query as data fetching/caching layer alongside openapi-client-axios
- Tamagui for several UI components

I aditionally used:

- Redux through Redux Toolkit and react-redux for state management, particularly during the edit/creation flows
- React Navigation to handle the stack navigation in the app
- react-native-date-picker for the date pickers in the Dates screen

### Getting started

This repository was created by forking the original repository shared in the assignment, so startup should be almost identical


```sh
git clone git@github.com:guillermoparral1995/jean_test_mobile.git

cd jean_test_mobile

bin/pull

# Make sure to add your token (sent by email)
cp .env.example .env
yarn start

yarn ios
```

### Explanation

For this case study I provided the following functionality:

- List existing invoices with relevant details: customer, price, total paid, invoice date and status
- Create new invoices
- Manage existing invoices
  - Edit invoices
  - Finalize invoices
  - Mark invoices as paid
  - Delete invoices

The behaviour may differ a bit from how it works in real life, but based on the provided API I made the following assumptions

- Invoices are created as unfinalized and unpaid by default
- Once an invoice is created, it can be deleted, finalized or edited
- Once an invoice is finalized, it can only be marked as paid (it can no longer be deleted or edited)
- Once it's paid, there's no more actions that can be applied to an invoice

The creation/edit flow follows a wizard pattern, where extra information is added in successive steps and can be cancelled at any point, resetting the creation flow to its initial state

### Future improvements / leftovers

- I have tested the filter parameter extensively for the list invoices endpoint, but was not able to get any different results. Having had more time, I would have liked to implement a filter functionality that works client side, in order to only show invoices of a specific status
- With the existing API one can only create invoices for existing customers or products. Something that could be useful would be to add new customers or products, either from a dedicated flow or in the invoice creation flow
- A more advanced feature that would be great would be the possibility of importing invoices from a file to be uploaded to the app via Drive or stored in memory (or even by scanning a printed invoice!)


### Testing

I created integration tests for each separate screen by wrapping them in a dedicate `TestWrapper` component, which has all providers except for the stack navigator, since I wanted to test each screen in isolation. This wrapper also creates a separate `QueryClient` per test, in order to avoid cache conflicts between tests for those screens that make HTTP requests. It also provides the possibility of passing an initial state to the Redux provider for screens that select info from the store on render, which was necessary due to each screen being tested in isolation

In order to mock HTTP requests I used `nock` library which provides a simple and easy-to-use interface to mock requests. This way, there is no need to mock openapi-client-axios or TanStack query, which is helpful to run the application closer to how it does in reality

Aside from that I also included unit tests for each React component. Ideally, I would have also liked to setup E2E tests with Appium, but that would have taken a longer time to setup so I decided to leave it aside for now.

To run the tests, just run

```
yarn test
```