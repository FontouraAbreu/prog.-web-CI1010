classesMatrix = [
    ["1º", "CI068", "CI055", "CM046", "CM045", "CM201"], // 1º
    ["2º", "CI210", "CI056", "CI067", "CM005", "CM202"], // 2º
    ["3º", "CI212", "CI057", "CI064", "CI237", "CI166"], // 3º
    ["4º", "CI215", "CI062", "CE003", "CI058", "CI164"], // 4º
    ["5º", "CI162", "CI065", "CI059", "CI061", "SA214"], // 5º
    ["6º", "CI163", "CI165", "CI209", "CI218", "CI220"], // 6º
    ["7º", "CI221", "CI211", "Optativas", "Optativas", "Trabalho de Graduação I"],     // 7º
    ["8º", "Optativas", "Optativas", "Optativas", "Optativas", "Trabalho de Graduação II"]        // 8º
]

student_optional_classes = [];  // array to store the optional classes of the student

history_is_visible = false;

document.addEventListener("DOMContentLoaded", function () {
    drawClassesGrid("");
    fetch("alunos.xml")
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xmlDocument = parser.parseFromString(data, "application/xml");
            // update the search_student variable when the input is changed
            var search_student = document.getElementById("searchStudent");
            document.addEventListener("change", function () {
                console.log(search_student.value);
                var students = getStudents(xmlDocument);
                // console.log("students:");
                // console.log(students);
                
                let students_filtered = students.filter(function (student) {
                    return student.toLowerCase().includes(search_student.value.toLowerCase());
                });
                if (search_student.value === "") {
                    students_filtered = [];
                }
                var student_clases = getStudentClasses(xmlDocument, students_filtered[0]);
                drawClassesGrid(student_clases);
            });
            // console.log(search_student);
            // students = studentsDetails(xmlDocument);
            // console.log(students);

        })
        .catch(error => console.log("Error:", error));
    });

// listener for clicking on a cell
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    var target = event.target;
    if (history_is_visible) {
        var classesHistory = document.getElementsByClassName("popuptext");
        for (var i = 0; i < classesHistory.length; i++) {
            classesHistory[i].style.display = "none";
        }
        history_is_visible = false;
    }
    if (target.id === "classCell") {
        history_is_visible = true;
        var targe_course_code = target.textContent;
        fetch("alunos.xml")
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xmlDocument = parser.parseFromString(data, "application/xml");
                var search_student = document.getElementById("searchStudent");
                console.log(search_student.value);
                if (search_student.value === "") {
                    return;
                }

                var students = getStudents(xmlDocument);
                let students_filtered = students.filter(function (student) {
                    return student.toLowerCase().includes(search_student.value.toLowerCase());
                });
                var student = students_filtered[0];
                var student_classes = getStudentClasses(xmlDocument, student);
                // console.log(targe_course_code);
                // console.log(student_classes);
                var course = student_classes.find(function (course) {
                    return course.course_code === targe_course_code || course.course_obligatory === targe_course_code;
                });
                if (student_classes === undefined) {
                    student_classes = [];
                }
                if (course === undefined) {
                    course = {
                        course_code: targe_course_code,
                        course_name: "Não encontrado",
                        year: "0",
                        semester: "0",
                        state: "Não encontrado",
                        frequency: "0",
                        grade: "0",
                    }
                }

                var class_history = getClassHistory(student_classes, course.course_code);
                if (class_history.length === 0 || course === undefined) {
                    class_history = []
                }

                // get the parent div based on the cell clicked
                var parent_target = target.parentElement;
                drawClassesHistory(class_history, parent_target);


            })
            .catch(error => console.log("Error:", error));
    }
});



function drawClassesGrid(student_classes) {
    var classesGrid = document.getElementById("classesGridContainer");
    if (!classesGrid) {
        console.error("Element with id 'classesGridContainer' not found.");
    }
    classesGrid.innerHTML = "";
    var classesGridTable = document.createElement("div");
    classesGridTable.className = "row";

    if (classesMatrix.length === 0) {
        console.error("Classes matrix is empty.");
    }

    student_optional_classes = [];
    for (var i = 0; i < classesMatrix.length; i++) {
        var classesRow = document.createElement("div");
        classesRow.className = "col classesGridColumn";
        for (var j = 0; j < classesMatrix[i].length; j++) {
            var classCell = document.createElement("div");
            classCell.className = "row-sm classesGridContent";
            classCell.id = "classCell";
            // if the student_classes is not undefined and the current cell is not the first one
            if (student_classes !== undefined && j != 0) {
                var course_code = classesMatrix[i][j];
                
                
                // if the course is an optional course
                if (classesMatrix[i][j] === "Optativas") {
                    course_code = getOptionalCourse(student_classes);
                }
                
                // if the course_code is undefined, then the course_code is the same as the previous one
                if (course_code === undefined) {
                    course_code = classesMatrix[i][j];
                }
                
                var course_state = getCourseState(student_classes, course_code);

                if (classesMatrix[i][j] === "Trabalho de Graduação I")

                // console.log(course_code);
                // console.log(classesMatrix[i][j]);
                // extract only the first word
                course_state = course_state.split(" ")[0];
                switch (course_state) {
                    case "Aprovado":
                        classCell.className += " classApproved";
                        break;
                    case "Dispensa":
                        classCell.className += " classApproved";
                        break;
                    case "Reprovado":
                        classCell.className += " classFailed";
                        break;
                    case "Matrícula":
                        classCell.className += " classEnrolled";
                        break;
                    case "Equivalência":
                        classCell.className += " classEquivalent";
                        break;
                    default:
                        classCell.className += " classNotEnrolled";
                        break;
                }
            }
            if (j == 0) {
                classCell.textContent = classesMatrix[i][j];
            }
            else {
                classCell.textContent = course_code;
            }
            classesRow.appendChild(classCell);
        }
        classesGridTable.appendChild(classesRow);
    }
    classesGrid.appendChild(classesGridTable);
}


function drawClassesHistory(class_history, target) {
    var classesHistory = document.getElementById("classesGridContainer");
    if (!classesHistory) {
        console.error("Element with id 'classesGridContainer' not found.");
    }

    var class_history_list = [];
    // draw as a list
    for (var i = 0; i < class_history.length; i++) {
        // create a div as a son of the target element
        var class_history_content = target.appendChild(document.createElement("div"));
        // set the width of the div
        class_history_content.style.width = "320px";
        // make the middle of the div in the middle of the target
        class_history_content.style.top = target.style.top;

        // set the class of the div
        class_history_content.className = "row-sm popuptext classesHistoryContent";


        class_history_content.textContent = 
            "\tCódigo: " + class_history[i].course_code + 
            "\r\n\tNome: " + class_history[i].course_name.toLowerCase() +
            "\r\n\tAno: " + class_history[i].year +
            "\r\n\tSemestre: " + class_history[i].semester +
            "\r\n\tSituação: " + class_history[i].state +
            "\r\n\tFrequência: " + parseFloat(class_history[i].frequency) +
            "\r\n\tNota: " + parseFloat(class_history[i].grade);
            
        // add arrows so that the user can change which classes are shown
        var arrow_right = class_history_content.appendChild(document.createElement("div"));
        arrow_right.className = "row-sm popuptext classesHistoryArrow";
        arrow_right.id = "arrowRight";
        arrow_right.textContent = ">";
        arrow_right.style.right = "0px";
        arrow_right.style.top = target.offsetTop + "px";
        arrow_right.style.position = "absolute";

        var arrow_left = class_history_content.appendChild(document.createElement("div"));
        arrow_left.className = "row-sm popuptext classesHistoryArrow";
        arrow_left.id = "arrowLeft";
        arrow_left.textContent = "<";
        arrow_left.style.left = "0px";
        arrow_left.style.top = target.offsetTop + "px";
        arrow_left.style.position = "absolute";

        // add the class to the list
        class_history_list.push(class_history_content);
    }

    
    // make only the first class visible
    if (class_history_list.length > 0) {
        class_history_list[0].style.display = "block";
    }

    addEventListener("click", function (event) {
        var target = event.target;
        if (target.id === "arrowRight") {
            // get the index of the current class
            var index = class_history_list.indexOf(target.parentElement);
            // make the current class invisible
            class_history_list[index].style.display = "none";
            // make the next class visible
            if (index + 1 === class_history_list.length) {
                class_history_list[0].style.display = "block";
            }
            else {
                class_history_list[index + 1].style.display = "block";
            }
            class_history_list[index + 1].style.display = "block";
        }
        else if (target.id === "arrowLeft") {
            // get the index of the current class
            var index = class_history_list.indexOf(target.parentElement);
            // make the current class invisible
            class_history_list[index].style.display = "none";
            // make the previous class visible
            if (index > 0) {
                class_history_list[index - 1].style.display = "block";
            }
            else {
                class_history_list[class_history_list.length - 1].style.display = "block";
            }
        }
    }
    );


    
    class_history_list.forEach(function (class_history_content) {
        class_history_content.style.display = "block";
    }
    );

    // make the popup visible
    // classesHistory.appendChild(classesHistoryTable);

    
}


function getClassHistory(student_classes, course_code) {
    var class_history = [];
    if (student_classes === undefined || student_classes.length === 0) {
        return class_history;
    }
    for (var i = 0; i < student_classes.length; i++) {
        if (student_classes[i].course_code === course_code) {
            class_history.push(student_classes[i]);
        }
    }
    return class_history;
}

function getCourseState(student_classes, course_code) {
    var state = "";
    if (course_code === "Optativas") {
        return state;
    }
    console.log(student_classes);
    for (var i = 0; i < student_classes.length; i++) {
        if (student_classes[i].course_code === course_code || student_classes[i].course_obligatory === course_code) {
            state = student_classes[i].state;
        }
    }
    return state;
}

function getOptionalCourse(student_classes) {
    for (var i = 0; i < student_classes.length; i++) {
        // if the course is an optional course
        if (student_classes[i].course_obligatory === "Optativas") {
            // ignore the classes that are already in the student_optional_classes
            if (student_optional_classes.includes(student_classes[i].course_code)) {
                continue;
            }
            else {
                student_optional_classes.push(student_classes[i].course_code);
            }
            return student_classes[i].course_code
        }
    }

}        
    

function getStudentClasses(xml, student_name) {
    var students = xml.getElementsByTagName("ALUNO");
    var classes_taken = [];
    // search for the correct student
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var student_name_xml = student.getElementsByTagName("MATR_ALUNO")[0].textContent;
        // if the student is found, extract the classes taken
        if (student_name_xml === student_name) {
            console.log(student_name);
            console.log(student_name_xml);
            classes_taken.push({
                course_code: student.getElementsByTagName("COD_ATIV_CURRIC")[0].textContent,
                course_name: student.getElementsByTagName("NOME_ATIV_CURRIC")[0].textContent,
                course_obligatory: student.getElementsByTagName("DESCR_ESTRUTURA")[0].textContent,
                year: student.getElementsByTagName("ANO")[0].textContent,
                semester: student.getElementsByTagName("PERIODO")[0].textContent,
                state: student.getElementsByTagName("SITUACAO")[0].textContent,
                frequency: student.getElementsByTagName("FREQUENCIA")[0].textContent,
                grade: student.getElementsByTagName("MEDIA_FINAL")[0].textContent,
            });
        }
    }
    return classes_taken;
}


// function to extract the students details from the xml file
function getStudents(xml) {
    // var students = xml_request.responseXML.getElementsByTagName("aluno");
    var students = xml.getElementsByTagName("ALUNO");
    // console.log(students);
    var students_unique = [];
    // extract the students names
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var student_name = student.getElementsByTagName("MATR_ALUNO")[0].textContent;
        if (!students_unique.includes(student_name)) {
            students_unique.push(student_name);
        }
    }
    // extracting 
    return students_unique;
}