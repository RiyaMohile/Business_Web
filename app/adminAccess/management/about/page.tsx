"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Minus,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  AboutPage,
  AboutSection,
  AboutPagePayload,
  getAllAboutPages,
  getAboutPageById,
  createAboutPage,
  updateAboutPage,
  deleteAboutPage,
} from "../../../services/aboutService";


/* =========================================================
   EMPTY SECTION
========================================================= */

const createEmptySection = (
  point: number
): AboutSection => ({
  point,
  title: "",
  description: "",
  content: [""],
});


/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  name: "",
  heading: "",
  description: "",
  version: "1.0.0",

  sections: [
    createEmptySection(1),
  ],

  footerText: {
    text: "",
    email: "",
    phone: "",
  },

  lastUpdated: "",
};


export default function AboutManagementPage() {
  const router = useRouter();

  /* =======================================================
     STATE
  ======================================================= */

  const [pages, setPages] =
    useState<AboutPage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [viewPage, setViewPage] =
    useState<AboutPage | null>(null);

  const [form, setForm] =
    useState(initialForm);


  /* =======================================================
     GET ALL PAGES
  ======================================================= */

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllAboutPages();

      if (response?.success) {
        setPages(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } else {
        setError(
          response?.message ||
            "Unable to fetch About pages"
        );
      }
    } catch (error: any) {
      console.error(
        "GET ABOUT PAGES ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to fetch About pages"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPages();
  }, []);


  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setForm({
      name: "",
      heading: "",
      description: "",
      version: "1.0.0",

      sections: [
        createEmptySection(1),
      ],

      footerText: {
        text: "",
        email: "",
        phone: "",
      },

      lastUpdated: "",
    });

    setEditingId(null);
  };


  /* =======================================================
     OPEN ADD
  ======================================================= */

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };


  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (
    page: AboutPage
  ) => {
    setEditingId(page._id);

    setForm({
      name: page.name || "",
      heading: page.heading || "",
      description:
        page.description || "",

      version:
        page.version || "1.0.0",

      sections:
        page.sections?.length
          ? page.sections.map(
              (section, index) => ({
                _id: section._id,
                point: index + 1,
                title:
                  section.title || "",
                description:
                  section.description ||
                  "",
                content:
                  section.content?.length
                    ? section.content
                    : [""],
              })
            )
          : [createEmptySection(1)],

      footerText: {
        text:
          page.footerText?.text ||
          "",

        email:
          page.footerText?.email ||
          "",

        phone:
          page.footerText?.phone ||
          "",
      },

      lastUpdated:
        page.lastUpdated
          ? new Date(
              page.lastUpdated
            )
              .toISOString()
              .split("T")[0]
          : "",
    });

    setShowModal(true);
  };


  /* =======================================================
     BASIC FORM CHANGE
  ======================================================= */

  const updateForm = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =======================================================
     FOOTER CHANGE
  ======================================================= */

  const updateFooter = (
    field: "text" | "email" | "phone",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,

      footerText: {
        ...prev.footerText,
        [field]: value,
      },
    }));
  };


  /* =======================================================
     SECTION CHANGE
  ======================================================= */

  const updateSection = (
    index: number,
    field:
      | "title"
      | "description",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,

      sections:
        prev.sections.map(
          (section, sectionIndex) =>
            sectionIndex === index
              ? {
                  ...section,
                  [field]: value,
                }
              : section
        ),
    }));
  };


  /* =======================================================
     ADD SECTION
  ======================================================= */

  const addSection = () => {
    setForm((prev) => ({
      ...prev,

      sections: [
        ...prev.sections,

        createEmptySection(
          prev.sections.length + 1
        ),
      ],
    }));
  };


  /* =======================================================
     DELETE SECTION
  ======================================================= */

  const removeSection = (
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,

      sections: prev.sections
        .filter(
          (_, sectionIndex) =>
            sectionIndex !== index
        )
        .map((section, index) => ({
          ...section,
          point: index + 1,
        })),
    }));
  };


  /* =======================================================
     ADD CONTENT
  ======================================================= */

  const addContentPoint = (
    sectionIndex: number
  ) => {
    setForm((prev) => ({
      ...prev,

      sections:
        prev.sections.map(
          (section, index) =>
            index === sectionIndex
              ? {
                  ...section,

                  content: [
                    ...section.content,
                    "",
                  ],
                }
              : section
        ),
    }));
  };


  /* =======================================================
     UPDATE CONTENT
  ======================================================= */

  const updateContentPoint = (
    sectionIndex: number,
    contentIndex: number,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,

      sections:
        prev.sections.map(
          (section, index) =>
            index === sectionIndex
              ? {
                  ...section,

                  content:
                    section.content.map(
                      (
                        content,
                        index
                      ) =>
                        index ===
                        contentIndex
                          ? value
                          : content
                    ),
                }
              : section
        ),
    }));
  };


  /* =======================================================
     DELETE CONTENT
  ======================================================= */

  const removeContentPoint = (
    sectionIndex: number,
    contentIndex: number
  ) => {
    setForm((prev) => ({
      ...prev,

      sections:
        prev.sections.map(
          (section, index) =>
            index === sectionIndex
              ? {
                  ...section,

                  content:
                    section.content.filter(
                      (_, index) =>
                        index !==
                        contentIndex
                    ),
                }
              : section
        ),
    }));
  };


  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Page name is required");
      return false;
    }

    if (!form.heading.trim()) {
      alert("Heading is required");
      return false;
    }

    for (
      let i = 0;
      i < form.sections.length;
      i++
    ) {
      const section =
        form.sections[i];

      if (!section.title.trim()) {
        alert(
          `Section ${
            i + 1
          } title is required`
        );

        return false;
      }

      const hasEmptyContent =
        section.content.some(
          (item) =>
            !item.trim()
        );

      if (hasEmptyContent) {
        alert(
          `Please fill all content points in Section ${
            i + 1
          }`
        );

        return false;
      }
    }

    return true;
  };


  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload: AboutPagePayload = {
        name: form.name.trim(),

        heading:
          form.heading.trim(),

        description:
          form.description.trim(),

        version:
          form.version.trim() ||
          "1.0.0",

        sections:
          form.sections.map(
            (section, index) => ({
              point: index + 1,

              title:
                section.title.trim(),

              description:
                section.description.trim(),

              content:
                section.content
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean),
            })
          ),

        footerText: {
          text:
            form.footerText.text.trim(),

          email:
            form.footerText.email.trim(),

          phone:
            form.footerText.phone.trim(),
        },

        lastUpdated:
          form.lastUpdated
            ? new Date(
                form.lastUpdated
              ).toISOString()
            : undefined,
      };


      let response;

      if (editingId) {
        response =
          await updateAboutPage(
            editingId,
            payload
          );
      } else {
        response =
          await createAboutPage(
            payload
          );
      }


      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to save page"
        );

        return;
      }


      alert(
        editingId
          ? "About page updated successfully"
          : "About page created successfully"
      );


      setShowModal(false);

      resetForm();

      await fetchPages();

    } catch (error: any) {
      console.error(
        "SAVE ABOUT PAGE ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to save About page"
      );
    } finally {
      setSaving(false);
    }
  };


  /* =======================================================
     VIEW SINGLE PAGE
  ======================================================= */

  const handleView = async (
    id: string
  ) => {
    try {
      const response =
        await getAboutPageById(id);

      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to get page"
        );

        return;
      }

      setViewPage(response.data);

      setShowViewModal(true);

    } catch (error: any) {
      console.error(
        "GET SINGLE ABOUT PAGE ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to get page"
      );
    }
  };


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    id: string,
    name: string
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await deleteAboutPage(id);

      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to delete page"
        );

        return;
      }

      alert(
        "About page deleted successfully"
      );

      await fetchPages();

    } catch (error: any) {
      console.error(
        "DELETE ABOUT PAGE ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to delete page"
      );
    }
  };


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                About Page Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage About pages
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Page
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  Total Pages
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {pages.length}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FileText size={22} />
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-medium text-gray-400">
              Latest Page
            </p>

            <p className="mt-2 truncate text-lg font-semibold text-gray-900">
              {pages[0]?.name ||
                "No pages"}
            </p>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className="text-base font-semibold text-gray-900">
              About Pages
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {pages.length} pages found
            </p>

          </div>


          {loading ? (

            <div className="flex min-h-[250px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="text-sm text-gray-500">
                  Loading pages...
                </p>

              </div>

            </div>

          ) : pages.length === 0 ? (

            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <FileText
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No About pages found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Create your first About page.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <div className="min-w-[1000px]">

                {/* TABLE HEADER */}

                <div className="grid grid-cols-[1.2fr_2fr_0.8fr_1.2fr_2fr] border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">

                  <span>Name</span>

                  <span>Heading</span>

                  <span>Version</span>

                  <span>Updated</span>

                  <span>Actions</span>

                </div>


                {/* TABLE ROWS */}

                {pages.map((page) => (

                  <div
                    key={page._id}
                    className="grid grid-cols-[1.2fr_2fr_0.8fr_1.2fr_2fr] items-center border-b border-gray-100 px-5 py-4 last:border-b-0 hover:bg-gray-50"
                  >

                    {/* NAME */}

                    <div className="min-w-0 pr-4">

                      <p className="truncate font-semibold text-gray-800">
                        {page.name}
                      </p>

                    </div>


                    {/* HEADING */}

                    <div className="min-w-0 pr-4">

                      <p className="truncate text-sm text-gray-700">
                        {page.heading}
                      </p>

                    </div>


                    {/* VERSION */}

                    <div>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        {page.version ||
                          "-"}
                      </span>

                    </div>


                    {/* UPDATED */}

                    <div>

                      <p className="text-sm text-gray-600">
                        {page.lastUpdated
                          ? new Date(
                              page.lastUpdated
                            ).toLocaleDateString()
                          : "-"}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            page._id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={14} />
                        View
                      </button>


                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(page)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-100"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            page._id,
                            page.name
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">

                  {editingId
                    ? "Edit About Page"
                    : "Add About Page"}

                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Manage page content and sections
                </p>

              </div>


              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>

            </div>


            {/* FORM */}

            <div className="space-y-6 p-6">

              {/* =========================================
                  BASIC INFORMATION
              ========================================= */}

              <div className="rounded-xl border border-gray-200 p-5">

                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Basic Information
                </h3>


                <div className="space-y-4">

                  {/* NAME */}

                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Page Name
                    </label>

                    <input
                      value={form.name}
                      onChange={(e) =>
                        updateForm(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="About Us"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />

                  </div>


                  {/* HEADING */}

                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Heading
                    </label>

                    <input
                      value={form.heading}
                      onChange={(e) =>
                        updateForm(
                          "heading",
                          e.target.value
                        )
                      }
                      placeholder="About Thover"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      value={
                        form.description
                      }
                      onChange={(e) =>
                        updateForm(
                          "description",
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Enter page description..."
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />

                  </div>


                  {/* VERSION + DATE */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Version
                      </label>

                      <input
                        value={
                          form.version
                        }
                        onChange={(e) =>
                          updateForm(
                            "version",
                            e.target.value
                          )
                        }
                        placeholder="1.0.0"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                      />

                    </div>


                    <div>

                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>

                      <input
                        type="date"
                        value={
                          form.lastUpdated
                        }
                        onChange={(e) =>
                          updateForm(
                            "lastUpdated",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* =========================================
                  SECTIONS
              ========================================= */}

              <div className="rounded-xl border border-gray-200 p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-gray-900">
                      Sections
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Add information sections to the page
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    <Plus size={14} />
                    Add Section
                  </button>

                </div>


                <div className="space-y-4">

                  {form.sections.map(
                    (
                      section,
                      sectionIndex
                    ) => (

                      <div
                        key={
                          section._id ||
                          sectionIndex
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >

                        {/* SECTION HEADER */}

                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                              {
                                section.point
                              }
                            </div>

                            <div>

                              <p className="text-sm font-semibold text-gray-800">
                                Section{" "}
                                {
                                  section.point
                                }
                              </p>

                              <p className="text-xs text-gray-400">
                                Section content
                              </p>

                            </div>

                          </div>


                          {form.sections
                            .length >
                            1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSection(
                                  sectionIndex
                                )
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          )}

                        </div>


                        {/* TITLE */}

                        <div className="mb-4">

                          <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            Title
                          </label>

                          <input
                            value={
                              section.title
                            }
                            onChange={(e) =>
                              updateSection(
                                sectionIndex,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Who We Are"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="mb-4">

                          <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            Description
                          </label>

                          <textarea
                            value={
                              section.description
                            }
                            onChange={(e) =>
                              updateSection(
                                sectionIndex,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            placeholder="Enter section description..."
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                          />

                        </div>


                        {/* CONTENT */}

                        <div>

                          <div className="mb-2 flex items-center justify-between">

                            <label className="text-xs font-medium text-gray-700">
                              Content Points
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                addContentPoint(
                                  sectionIndex
                                )
                              }
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                              + Add Point
                            </button>

                          </div>


                          <div className="space-y-2">

                            {section.content.map(
                              (
                                content,
                                contentIndex
                              ) => (

                                <div
                                  key={
                                    contentIndex
                                  }
                                  className="flex gap-2"
                                >

                                  <input
                                    value={
                                      content
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateContentPoint(
                                        sectionIndex,
                                        contentIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Content point ${
                                      contentIndex +
                                      1
                                    }`}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                  />


                                  {section
                                    .content
                                    .length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeContentPoint(
                                          sectionIndex,
                                          contentIndex
                                        )
                                      }
                                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    >
                                      <Minus
                                        size={
                                          16
                                        }
                                      />
                                    </button>
                                  )}

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* =========================================
                  FOOTER
              ========================================= */}

              <div className="rounded-xl border border-gray-200 p-5">

                <h3 className="text-sm font-semibold text-gray-900">
                  Footer Information
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Contact information displayed in the footer.
                </p>


                <div className="mt-4 space-y-4">

                  {/* TEXT */}

                  <div>

                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                      Footer Text
                    </label>

                    <textarea
                      value={
                        form.footerText
                          .text
                      }
                      onChange={(e) =>
                        updateFooter(
                          "text",
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="© 2026 Thover"
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />

                  </div>


                  {/* EMAIL + PHONE */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Email
                      </label>

                      <input
                        type="email"
                        value={
                          form.footerText
                            .email
                        }
                        onChange={(e) =>
                          updateFooter(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="support@thover.in"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Phone
                      </label>

                      <input
                        type="text"
                        value={
                          form.footerText
                            .phone
                        }
                        onChange={(e) =>
                          updateFooter(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* =========================================
                  FORM BUTTONS
              ========================================= */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSubmit}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Page"
                    : "Create Page"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {showViewModal &&
        viewPage && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    {viewPage.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {viewPage.heading}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(
                      false
                    );

                    setViewPage(null);
                  }}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>

              </div>


              {/* CONTENT */}

              <div className="space-y-6 p-6">

                {/* DESCRIPTION */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {viewPage.description ||
                      "No description"}
                  </p>

                </div>


                {/* VERSION */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Version
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {viewPage.version ||
                        "-"}
                    </p>

                  </div>


                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Last Updated
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {viewPage.lastUpdated
                        ? new Date(
                            viewPage.lastUpdated
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                </div>


                {/* SECTIONS */}

                <div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sections
                  </p>


                  <div className="space-y-4">

                    {viewPage.sections?.length ? (
                      viewPage.sections.map(
                        (
                          section,
                          index
                        ) => (

                          <div
                            key={
                              section._id ||
                              index
                            }
                            className="rounded-xl border border-gray-200 p-4"
                          >

                            <div className="flex items-start gap-3">

                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                                {
                                  section.point
                                }
                              </div>


                              <div className="min-w-0 flex-1">

                                <h3 className="font-semibold text-gray-900">
                                  {
                                    section.title
                                  }
                                </h3>


                                {section.description && (
                                  <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {
                                      section.description
                                    }
                                  </p>
                                )}


                                {section.content
                                  ?.length >
                                  0 && (

                                  <ul className="mt-3 space-y-2">

                                    {section.content.map(
                                      (
                                        item,
                                        contentIndex
                                      ) => (

                                        <li
                                          key={
                                            contentIndex
                                          }
                                          className="flex gap-2 text-sm text-gray-600"
                                        >

                                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                                          <span>
                                            {item}
                                          </span>

                                        </li>

                                      )
                                    )}

                                  </ul>

                                )}

                              </div>

                            </div>

                          </div>

                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-400">
                        No sections available.
                      </p>
                    )}

                  </div>

                </div>


                {/* FOOTER */}

                <div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Footer Information
                  </p>


                  <div className="grid gap-4 sm:grid-cols-3">

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Text
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {viewPage.footerText
                          ?.text ||
                          "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-800">
                        {viewPage.footerText
                          ?.email ||
                          "-"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {viewPage.footerText
                          ?.phone ||
                          "-"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}