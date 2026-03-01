# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes — prefer test DB)
- Time/randomness
- File system (sometimes)

**Don't mock:**

- Your own classes/modules
- Internal collaborators
- Anything you control

If you're mocking your own code, your design is too coupled. Fix the design, not the test.

## Designing for Mockability

### 1. Use dependency injection

Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock — dependency is a parameter
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock — dependency is created internally
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

### 2. Prefer SDK-style interfaces over generic fetchers

Create specific functions for each external operation:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

The SDK approach means:
- Each mock returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Type safety per endpoint

## Testing Anti-Patterns with Mocks

- **Testing mock behavior instead of real behavior** — your test passes but proves nothing
- **Adding test-only methods to production classes** — if you need special access for tests, your interface is wrong
- **Mocking without understanding dependencies** — understand what you're replacing before you replace it
