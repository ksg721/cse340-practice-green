import {
  getFacultyById,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";

// Route handler for the faculty list page
const facultyListPage = (req, res) => {
  const SortOptions = ["name", "department", "title"];
  const requestedSort = req.query.sort;
  const sortBy = SortOptions.includes(requestedSort) ? requestedSort : "name";
  const faculty = getSortedFaculty(sortBy);

  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty,
    currentSort: sortBy,
  });
};

// Route handler for an individual faculty detail page
const facultyDetailPage = (req, res, next) => {
  const facultyId = req.params.facultyId;
  const faculty = getFacultyById(facultyId);

  // If the faculty member does not exist, create a 404 error.
  if (!faculty) {
    const err = new Error(`Faculty ${facultyId} not found`);
    err.status = 404;
    return next(err);
  }

  res.render("faculty/detail", {
    title: `${faculty.name} - Faculty Details`,
    faculty: { ...faculty, id: facultyId },
  });
};

export { facultyListPage, facultyDetailPage };
