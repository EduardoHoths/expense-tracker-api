import { UuidService } from "../../../shared/services/uuid-service";
import { ExpenseCategory } from "./expense-category";

interface ExpenseProps {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  description: string;
  category: ExpenseCategory;
}

export class Expense {
  private constructor(private props: ExpenseProps) {}

  public static create({
    amount,
    description,
    category,
    date,
    userId,
  }: Omit<ExpenseProps, "id">) {
    this.validate(amount, date, category, description);

    return new Expense({
      id: UuidService.generate(),
      amount,
      description,
      category,
      date,
      userId,
    });
  }

  public static with(props: ExpenseProps) {
    return new Expense(props);
  }

  private static validate(
    amount: number,
    date: Date,
    category: ExpenseCategory,
    description: string
  ) {
    if (!this.isValidAmount(amount)) {
      throw new Error("Amount must be positive");
    }

    if (!this.isValidDate(date)) {
      throw new Error("Invalid date");
    }

    if (!this.isValidCategory(category)) {
      throw new Error("Invalid category");
    }

    if (!this.isValidDescription(description)) {
      throw new Error("Description must be less than 50 characters");
    }
  }

  private static isValidAmount(amount: number) {
    return amount > 0;
  }

  private static isValidDate(date: Date) {
    return new Date().getTime() > date.getTime();
  }

  private static isValidCategory(category: ExpenseCategory) {
    return Object.values(ExpenseCategory).includes(category);
  }

  private static isValidDescription(description: string) {
    return description.length <= 50;
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get date() {
    return this.props.date;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get category() {
    return this.props.category;
  }
}
