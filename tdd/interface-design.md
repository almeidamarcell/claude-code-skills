# Interface Design for Testability

Good interfaces make testing natural. Bad interfaces make you reach for mocks.

## Three Principles

### 1. Accept dependencies, don't create them

```typescript
// Testable
function processOrder(order, paymentGateway) {}

// Hard to test — creates its own dependency
function processOrder(order) {
  const gateway = new StripeGateway();
}
```

### 2. Return results, don't produce side effects

```typescript
// Testable — assert on return value
function calculateDiscount(cart): Discount {}

// Hard to test — mutates input, nothing to assert on
function applyDiscount(cart): void {
  cart.total -= discount;
}
```

### 3. Small surface area

- Fewer methods = fewer tests needed
- Fewer params = simpler test setup
- See [deep-modules.md](deep-modules.md) for more on this

## The Diagnostic

If a function is hard to test, it's hard to use. The test is your first user. Listen to it.
