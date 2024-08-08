import { budgetApi } from "@/lib/axios";
import { MonthDate } from "@/lib/validation/base";

interface RequestIds {
  budgetId: string;
  subcategoryId: string;
}

interface CreateSubcategory {
  budgetId: string;
  parentCategoryId: string;
  subcategoryName: string;
}

interface EditSubcategoryName extends RequestIds {
  subcategoryName: string;
}

export interface FormAssignment {
  assignedAmount: number;
  assignmentMonth: MonthDate;
}

interface Assign extends RequestIds {
  assignment: FormAssignment;
}

export interface FormTarget {
  targetAmount: number;
  startedAt: MonthDate;
  targetUpToMonth: MonthDate;
}

export interface CreateTargetForm extends RequestIds {
  formTarget: FormTarget;
}

interface CreateSubcategoryDescription extends RequestIds {
  newDescription: string;
}

export const createSubcategory = ({
  budgetId,
  parentCategoryId,
  subcategoryName,
}: CreateSubcategory) =>
  budgetApi.post(`/${budgetId}/subcategories`, {
    parentCategoryId,
    subcategoryName,
  });

export const editSubcategoryName = ({
  budgetId,
  subcategoryId,
  subcategoryName,
}: EditSubcategoryName) =>
  budgetApi.put(`/${budgetId}/subcategories/${subcategoryId}`, {
    newName: subcategoryName,
  });

export const assign = ({ budgetId, subcategoryId, assignment }: Assign) =>
  budgetApi.put(
    `/${budgetId}/subcategories/${subcategoryId}/assignment`,
    assignment,
  );

export const createTarget = ({
  budgetId,
  subcategoryId,
  formTarget,
}: CreateTargetForm) =>
  budgetApi.put(
    `/${budgetId}/subcategories/${subcategoryId}/target`,
    formTarget,
  );

export const createSubcategoryDescription = ({
  budgetId,
  subcategoryId,
  newDescription,
}: CreateSubcategoryDescription) =>
  budgetApi.put(`/${budgetId}/subcategories/${subcategoryId}`, {
    newDescription,
  });

export const deleteSubcategory = ({ budgetId, subcategoryId }: RequestIds) =>
  budgetApi.delete(`/${budgetId}/subcategories/${subcategoryId}`);
