const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });

app.get('/api/posts/:year/:month', (req, res) => {
    //http://localhost:3000/api/posts/2020/01?orderBy=name
    res.send(req.query);
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course)  return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    
    // if (!req.body.name || req.body.name.length <3 ) {
    //     res.status(400).send('Name is required and should be minimun 3 characters.');
    //     return;
    // }
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

function validateCourse (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.listen(3000, () => console.log('Listening on prot 3000...'));