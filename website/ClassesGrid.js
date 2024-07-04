classesMatrix = [
    ["1º", "CI068", "CI055", "CM046", "CM045", "CM201"], // 1º
    ["2º", "CI210", "CI056", "CI067", "CM005", "CM202"], // 2º
    ["3º", "CI212", "CI057", "CI064", "CI123", "CI166"], // 3º
    ["4º", "CI215", "CI062", "CE003", "CI058", "CI164"], // 4º
    ["5º", "CI162", "CI065", "CI059", "CI061", "SA214"], // 5º
    ["6º", "CI163", "CI165", "CI209", "CI218", "CI220"], // 6º
    ["7º", "CI221", "CI211", "OPT", "OPT", "TG I"],     // 7º
    ["8º", "OPT", "OPT", "OPT", "OPT", "TG II"]         // 8º
]

document.addEventListener("DOMContentLoaded", function () {
    drawClassesGrid();
    fetch("alunos.xml")
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xmlDocument = parser.parseFromString(data, "application/xml");
            // update the search_student variable when the input is changed
            document.addEventListener("input", function () {
                var search_student = document.getElementById("searchStudent");
                var search_student_value = search_student.value;

                var students = getStudents(xmlDocument);
                let students_filtered = students.filter(function (student) {
                    return student.toLowerCase().includes(search_student_value.toLowerCase());
                });
                console.log(students_filtered);
                var student_info = getStudentInfo(xmlDocument, students_filtered[0]);
                drawClassesGrid(student_info);
            });
            // console.log(search_student);
            // students = studentsDetails(xmlDocument);
            // console.log(students);

        })
        .catch(error => console.log("Error:", error));
    });

function drawClassesGrid(student_info) {
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


    for (var i = 0; i < classesMatrix.length; i++) {
        var classesRow = document.createElement("div");
        classesRow.className = "col";
        for (var j = 0; j < classesMatrix[i].length; j++) {
            var classCell = document.createElement("div");
            classCell.className = "row-sm classesGridContent";
            // if the student_info is not undefined and the current cell is not the first one
            if (student_info !== undefined && j != 0) {
                var course_state = getCourseState(student_info, classesMatrix[i][j]);
                // console.log(classesMatrix[i][j]);
                console.log(course_state);
                // extract only the first word
                // course_state = course_state.split(" ")[0];
                switch (course_state) {
                    case "Aprovado":
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
            classCell.textContent = classesMatrix[i][j];
            classesRow.appendChild(classCell);
        }
        classesGridTable.appendChild(classesRow);
    }
    classesGrid.appendChild(classesGridTable);
}

function getCourseState(student_info, course_code) {
    var state = "";
    for (var i = 0; i < student_info.length; i++) {
        if (student_info[i].course_code === course_code) {
            state = student_info[i].state;
        }
    }
    return state;
}

    

function getStudentInfo(xml, student_name) {
    var students = xml.getElementsByTagName("ALUNO");
    var students_info = [];
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var student_name_xml = student.getElementsByTagName("NOME_ALUNO")[0].textContent;
        if (student_name_xml === student_name) {
            var student_info = {
                course: student.getElementsByTagName("NOME_ATIV_CURRIC")[0].textContent,
                course_code: student.getElementsByTagName("COD_ATIV_CURRIC")[0].textContent,
                course_obligatory: student.getElementsByTagName("DESCR_ESTRUTURA")[0].textContent,
                year: student.getElementsByTagName("ANO")[0].textContent,
                semester: student.getElementsByTagName("PERIODO")[0].textContent,
                state: student.getElementsByTagName("SITUACAO")[0].textContent,
                frequency: student.getElementsByTagName("FREQUENCIA")[0].textContent,
                grade: student.getElementsByTagName("MEDIA_FINAL")[0].textContent
            };
            // desirealize the student_info object
            students_info.push(student_info);
        }
    }
    console.log("student info:");
    console.log(students_info);
    return students_info;
}

// function to extract the students details from the xml file
function getStudents(xml) {
    // var students = xml_request.responseXML.getElementsByTagName("aluno");
    console.log(xml);
    var students = xml.getElementsByTagName("ALUNO");
    // console.log(students);
    var students_unique = [];
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var student_name = student.getElementsByTagName("NOME_ALUNO")[0].textContent;
        var student_registry = student.getElementsByTagName("MATR_ALUNO")[0].textContent;
        if (!students_unique.includes(student_name)) {
            students_unique.push(student_name);
        }
    }
    // extracting 
    return students_unique;
}