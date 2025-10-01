import { Prisma } from "@prisma/client";

interface QueryString {
  [key: string]: any;
}

export class ApiFeatures<T extends Prisma.NotificationWhereInput> {
  private queryString: QueryString;
  private prismaArgs: Prisma.NotificationFindManyArgs;
  private where: Prisma.NotificationWhereInput = {};

  constructor(queryString: QueryString) {
    this.queryString = queryString;
    this.prismaArgs = {};
  }

  // Filtering
  filter() {
    const filterFields = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "aggregate",
    ];
    excludedFields.forEach((field) => delete filterFields[field]);

    // Convert string "true"/"false" to boolean
    Object.keys(filterFields).forEach((key) => {
      if (filterFields[key] === "true") filterFields[key] = true;
      if (filterFields[key] === "false") filterFields[key] = false;
      if (filterFields[key] === null || filterFields[key] === "null") {
        filterFields[key] = { equals: null };
      }
    });
    console.log("filterFields", filterFields);
    this.prismaArgs.where = filterFields as T;
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field: string) => {
        if (field.startsWith("-")) {
          return { [field.substring(1)]: "desc" };
        }
        return { [field]: "asc" };
      });
      this.prismaArgs.orderBy = sortBy;
    } else {
      this.prismaArgs.orderBy = [{ createdAt: "desc" }];
    }
    return this;
  }

  // Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");
      this.prismaArgs.select = fields.reduce(
        (acc: any, field: string) => ({ ...acc, [field]: true }),
        {}
      );
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;

    this.prismaArgs.skip = skip;
    this.prismaArgs.take = limit;
    return this;
  }

  // Search
  search(fields: string[]) {
    if (this.queryString.search) {
      const searchText = this.queryString.search;
      this.prismaArgs.where = {
        ...this.prismaArgs.where,
        OR: fields.map((field) => ({
          [field]: { contains: searchText, mode: "insensitive" },
        })),
      } as Prisma.NotificationWhereInput;
    }
    return this;
  }

  // Get Prisma args
  build() {
    return this.prismaArgs;
  }
}
