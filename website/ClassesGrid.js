document.addEventListener("DOMContentLoaded", function () {
    fetch("alunos.xml")
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xmlDocument = parser.parseFromString(data, "application/xml");
            studentsDetails(xmlDocument);
        })
        .catch(error => console.log("Error:", error));
    });

function studentsDetails(xml) {
    // var students = xml_request.responseXML.getElementsByTagName("aluno");
    console.log(xml);
    var students = xml.getElementsByTagName("ALUNO");
    console.log(students);
    var students_unique = [];
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var student_name = student.getElementsByTagName("NOME_ALUNO")[0].textContent;
        if (!students_unique.includes(student_name)) {
            students_unique.push(student_name);
        }
    }
    console.log(students_unique);
    // extracting 
}