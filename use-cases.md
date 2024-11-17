# Use Cases

## Use Case 1: User Registration (Sign Up)

**Description**: A user can register in the application by providing email, password and name.

- [x] Email must be unique
- [x] If is the first user, the user will be admin

## Use Case 2: User Authentication (Login)

**Description**: User can login to the application using email and password.

- [ ] Valid email and password for login
- [ ] Return authentication error for invalid credentials
- [ ] Generate JWT token after login with configurable expiration
  
## Use Case 3: Add New Expense (Create Expense)

**Description**: User can add a new expense by providing description, amount, date and category.

- [x] The expense amount must be positive
- [x] The expense date cannot be in the future
- [x] The category must be one of the predefined options 
- [ ] User must be authenticated to create expense

## Use Case 4: List and Filter Expenses

**Description**: User can list and filter their past expenses.

- [ ] Authentication required to list expenses
- [ ] Return expenses only from authenticated user
- [ ] Support for date filters (week, month, quarter, custom)
- [ ] Return empty list if no expenses in the period

## Use Case 5: Update Expense

**Description**: User can update an existing expense.

- [ ] Authentication required to update expense
- [ ] Only possible to update user's own expenses
- [ ] Apply the same validations from creation when updating
- [ ] Return error if expense is not found
  
## Use Case 6: Delete Expense

**Description**: User can delete an existing expense.

- [ ] Authentication required to delete expense
- [ ] Only possible to delete user's own expenses
- [ ] Return error if expense is not found

## Use Case 7: JWT Authentication

**Description**: The application must use JWT to authenticate users and protect endpoints.

- [ ] JWT required for all expense endpoints
- [ ] JWT must have configurable expiration
- [ ] JWT token invalidation after logout or expiration