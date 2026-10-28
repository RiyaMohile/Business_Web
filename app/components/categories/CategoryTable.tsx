"use client";

import CategoryRow from "./CategoryRow";

interface Category {
  _id: string;
  category: string;
  subCategory: string;
  examples: string[];
}

interface Props {
  categories: Category[];
  loading: boolean;
  onDelete: (category: Category) => void;
  onViewExamples: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  loading,
  onDelete,
  onViewExamples,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* Only table area scrolls */}
      <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

        <table className="min-w-[800px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="whitespace-nowrap p-4 text-left">
                Category
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Sub Category
              </th>

              <th className="whitespace-nowrap p-4 text-center">
                Examples
              </th>

              <th className="whitespace-nowrap p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : categories.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center"
                >
                  No Categories Found
                </td>
              </tr>

            ) : (

              categories.map((category) => (

                <CategoryRow
                  key={category._id}
                  category={category}
                  onDelete={onDelete}
                  onViewExamples={onViewExamples}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}