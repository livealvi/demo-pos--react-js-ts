import * as yup from "yup";

export const schemaStock = yup.object().shape({
  name: yup.string().trim().required("please insert part"),
  description: yup.string().trim().required("please insert description"),
  mrp: yup.number().typeError("please insert mrp, only number"),
  costing: yup.number().typeError("please insert costing, only number"),
  wholesale: yup.number().typeError("please insert wholesale, only number"),
  retail: yup.number().typeError("please insert retail, only number"),
  quantity: yup
    .number()
    .positive()
    .typeError("please insert quantity, only number"),
  categoryId: yup.number().positive().typeError("please select a category"),
  reminder: yup
    .number()
    .test(
      "Is positive?",
      "reminder must be a positive number",
      (value: any) => value >= 0
    )
    .typeError("please insert reminder, only number"),
});

export const schemaAddStock = yup.object().shape({
  name: yup.string().trim().required("please insert part"),
  description: yup.string().trim().required("please insert description"),
  mrp: yup.number().typeError("please insert mrp, only number"),
  costing: yup.number().typeError("please insert costing, only number"),
  wholesale: yup.number().typeError("please insert wholesale, only number"),
  retail: yup.number().typeError("please insert retail, only number"),
  quantity: yup.number().typeError("please insert quantity, only number"),
  subcategoryId: yup
    .number()
    .positive()
    .typeError("please select a sub-category"),
  categoryId: yup.number().positive().typeError("please select a category"),
  reminder: yup
    .number()
    .test(
      "Is positive?",
      "reminder must be a positive number",
      (value: any) => value >= 0
    )
    .typeError("please insert reminder, only number"),
});

export const schema = yup.object().shape({
  name: yup.string().trim().required("please insert part"),
  description: yup.string().trim().required("please insert description"),
  mrp: yup.number().positive().typeError("please insert mrp, only number"),
  costing: yup
    .number()
    .positive()
    .typeError("please insert costing, only number"),
  wholesale: yup
    .number()
    .positive()
    .typeError("please insert wholesale, only number"),
  retail: yup
    .number()
    .positive()
    .typeError("please insert retail, only number"),
  quantity: yup
    .number()
    .positive()
    .typeError("please insert quantity, only number"),
  subcategoryId: yup
    .number()
    .positive()
    .typeError("please select a sub-category"),
  categoryId: yup.number().positive().typeError("please select a category"),
  reminder: yup
    .number()
    .test(
      "Is positive?",
      "reminder must be a positive number",
      (value: any) => value >= 0
    )
    .typeError("please insert reminder, only number"),
  customerName: yup.string().trim().required("please insert name"),
  email: yup.string().trim(),
  phone: yup.string().trim().required("please insert phone"),
  address: yup.string().trim(),
});

export const schemaUser = yup.object().shape({
  name: yup.string().trim().required("please insert name"),
  password: yup
    .string()
    .trim()
    .required("please insert password")
    .min(6, "minium 6 character"),
  email: yup.string().email().trim().required("please insert mail"),
  roleId: yup.number().positive().typeError("please insert role"),
});

export const schemaAddUser = yup.object().shape({
  name: yup.string().trim().required("please insert name"),
  password: yup
    .string()
    .trim()
    .required("please insert password")
    .min(6, "minium 6 character"),
  confirmPassword: yup
    .string()
    .trim()
    .required("please insert password")
    .oneOf([yup.ref("password")], "passwords do not match")
    .min(6, "minium 6 character"),
  email: yup.string().email().trim().required("please insert mail"),
  roleId: yup.number().positive().typeError("please insert role"),
});

export const schemaCategory = yup.object().shape({
  name: yup.string().trim().required("please insert category"),
});

export const schemaRack = yup.object().shape({
  name: yup.string().trim().required("please insert rack"),
  description: yup.string().trim(),
});

export const schemaLevel = yup.object().shape({
  name: yup.string().trim().required("please insert level"),
  description: yup.string().trim(),
});

export const schemaCustomer = yup.object().shape({
  name: yup.string().trim().required("please insert name"),
  email: yup.string().email().trim(),
  phone: yup.string().trim().required("please insert phone"),
  address: yup.string().trim(),
});

export const schemaDue = yup.object().shape({
  title: yup.string().trim().required("please insert title"),
  description: yup.string().trim(),
  amount: yup.number().positive().required("please insert amount"),
});

export const schemaEditDue = yup.object().shape({
  description: yup.string().trim(),
  collection: yup
    .number()
    .positive()
    .required("please insert amount")
    .typeError("please insert amount"),
});
