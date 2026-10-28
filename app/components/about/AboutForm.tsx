"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface AboutFormProps {
  pageId?: string;
  edit?: boolean;
}

export default function AboutForm({
  pageId,
  edit = false,
}: AboutFormProps) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    heading: "",
    description: "",
    version: "1.0.0",
    sections: [],
    footerText: {
      text: "",
      email: "",
      phone: "",
    },
    lastUpdated: "",
  });


useEffect(() => {
  if (edit && pageId) {
    fetchPage();
  }
}, [edit, pageId]);

const createPage = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      "https://api.thover.in/v1/api/about/add",
      {
        name: form.name,
        heading: form.heading,
        description: form.description,
        version: form.version,
        sections: form.sections,
        footerText: form.footerText,
        lastUpdated: form.lastUpdated,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(data.message);

  } catch (err: any) {
    alert(err.response?.data?.message || "Unable to create page");
  } finally {
    setLoading(false);
  }
};
const fetchPage = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `https://api.thover.in/v1/api/about/${pageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setForm({
      name: data.data.name,
      heading: data.data.heading,
      description: data.data.description,
      version: data.data.version,
      sections: data.data.sections,
      footerText: data.data.footerText,
      lastUpdated: data.data.lastUpdated?.substring(0, 10),
    });

  } catch (err) {
    console.log(err);
  }
};
const updatePage = async () => {
  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    const { data } = await axios.put(
      `https://api.thover.in/v1/api/about/update/${pageId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(data.message);

  } catch (err: any) {

    alert(
      err.response?.data?.message ||
      "Unable to update page"
    );

  } finally {

    setLoading(false);

  }
};
  return (

    
    <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-4 shadow-lg md:p-8">

      <h2 className="text-2xl font-bold md:text-3xl">
        Create / Update Page
      </h2>

      <p className="mt-2 text-gray-500">
        Manage Privacy Policy, Terms of Use and About Us.
      </p>

      {/* Page Name */}

      <div className="mt-8">

        <label className="block font-semibold mb-2">
          Page Name
        </label>

        <select
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-300"
>
  <option value="">Select Page</option>

  <option value="privacy-policy">
    Privacy Policy
  </option>

  <option value="terms-of-use">
    Terms of Use
  </option>

  <option value="about-us">
    About Us
  </option>
</select>

      </div>

      {/* Heading */}

      <div className="mt-6">

        <label className="block font-semibold mb-2">
          Heading
        </label>

       <input
  type="text"
  value={form.heading}
  onChange={(e) =>
    setForm({
      ...form,
      heading: e.target.value,
    })
  }
  className="w-full border rounded-xl p-3"
/>

      </div>

      {/* Description */}

      <div className="mt-6">

        <label className="block font-semibold mb-2">
          Description
        </label>

        <textarea
  rows={4}
  value={form.description}
  onChange={(e) =>
    setForm({
      ...form,
      description: e.target.value,
    })
  }
  className="w-full border rounded-xl p-3"
/>

      </div>

      {/* Version */}

      <div className="mt-6">

        <label className="block font-semibold mb-2">
          Version
        </label>

        <input
  type="text"
  value={form.version}
  onChange={(e) =>
    setForm({
      ...form,
      version: e.target.value,
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-300"
/>

      </div>

      {/* Sections */}

      <div className="mt-10">

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">

          <h3 className="text-xl font-semibold md:text-2xl">
  Sections
</h3>

          <button
  type="button"
  className="w-full rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 sm:w-auto"
>
  + Add Section
</button>

        </div>

        {/* Section */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6">

          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">

            <h4 className="text-lg font-semibold md:text-xl">
  Section 1
</h4>

            <button
              type="button"
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>

          </div>

          {/* Point */}

          <div className="mt-5">

            <label className="block font-medium mb-2">
              Point Number
            </label>

            <input
              type="number"
              placeholder="1"
              className="w-full border border-gray-300 rounded-xl p-3"
            />

          </div>

          {/* Title */}

          <div className="mt-5">

            <label className="block font-medium mb-2">
              Title
            </label>

            <input
              type="text"
              placeholder="Introduction"
              className="w-full border border-gray-300 rounded-xl p-3"
            />

          </div>

          {/* Description */}

          <div className="mt-5">

            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              rows={3}
              placeholder="Section description..."
              className="w-full border border-gray-300 rounded-xl p-3"
            />

          </div>

          {/* Content */}

          <div className="mt-6">

            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">

              <h5 className="font-semibold text-lg">
                Content
              </h5>

              <button
  type="button"
  className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 sm:w-auto"
>
  + Add Content
</button>

            </div>

            <div className="mt-4 space-y-3">

             <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  placeholder="Enter content"
                  className="flex-1 border border-gray-300 rounded-xl p-3"
                />

                <button
                  type="button"
                  className="w-full rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 sm:w-auto"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-10">

        <h3 className="text-2xl font-semibold">
          Footer
        </h3>

        <div className="mt-5">

          <label className="block font-medium mb-2">
            Footer Text
          </label>

          <textarea
  rows={3}
  value={form.footerText.text}
  onChange={(e) =>
    setForm({
      ...form,
      footerText: {
        ...form.footerText,
        text: e.target.value,
      },
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3"
/>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">

          <div>

            <label className="block font-medium mb-2">
              Email
            </label>

            <input
  type="email"
  value={form.footerText.email}
  onChange={(e) =>
    setForm({
      ...form,
      footerText: {
        ...form.footerText,
        email: e.target.value,
      },
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3"
/>

          </div>

          <div>

            <label className="block font-medium mb-2">
              Phone
            </label>

            <input
  type="text"
  value={form.footerText.phone}
  onChange={(e) =>
    setForm({
      ...form,
      footerText: {
        ...form.footerText,
        phone: e.target.value,
      },
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3"
/>

          </div>

        </div>

      </div>

      {/* Last Updated */}

      <div className="mt-6">

        <label className="block font-medium mb-2">
          Last Updated
        </label>

        <input
  type="date"
  value={form.lastUpdated}
  onChange={(e) =>
    setForm({
      ...form,
      lastUpdated: e.target.value,
    })
  }
  className="w-full border border-gray-300 rounded-xl p-3"
/>

      </div>

      {/* Buttons */}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">

        <button
  type="button"
  className="w-full rounded-xl bg-gray-300 px-6 py-3 hover:bg-gray-400 sm:w-auto"
>
  Cancel
</button>

        <button
  type="button"
  onClick={() => {
  if (edit) {
    updatePage();
  } else {
    createPage();
  }
}}
  disabled={loading}
   className="w-full rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 sm:w-auto"
>
  {loading
  ? "Saving..."
  : edit
  ? "Update Page"
  : "Create Page"}
</button>

      </div>

    
    </div>

  );
}