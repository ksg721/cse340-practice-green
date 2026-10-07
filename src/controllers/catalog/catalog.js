import { getAllCourses, getCourseById, getSortedSections } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = (req, res) => {
    const courses = getAllCourses();

    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
};

// Route handler for individual course detail pages
const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;
    const course = getCourseById(courseId);

    // If course doesn't exist, create 404 error
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Accept only supported sort options; default to the original order.
    const supportedSortOptions = ['time', 'professor', 'room'];
    const requestedSort = req.query.sort;
    const sortBy = supportedSortOptions.includes(requestedSort) ? requestedSort : 'time';
    const sortedSections = getSortedSections(course.sections, sortBy);

    res.render('course-details', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };
