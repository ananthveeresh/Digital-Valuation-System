// app.js
var app = angular.module("pdfAnnotationApp2", []);

app.controller(
  "PdfAnnotationController2",
  function ($http, $scope, $sce, $timeout) {
    $scope.pageNum = 3;
    $scope.deleteradius = 50;
    $scope.deletemode = false;
    $scope.drawingMode = false;
    $scope.annotations = [];
    $scope.selectedQuestionValue = "";
    $scope.selected_ques_obj = [];
    $scope.addingMarks = false;
    $scope.qnos = [];
    $scope.Marks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.selectedMarks = "";
    $scope.gained_marks = 0;
    $scope.marked_questions = [];
    $scope.total_no_of_pages = 0;
    $scope.visitedPages = [];
    $scope.pdfload = 0;

    // alert("working")
    $scope.correctionpaperinfo = JSON.parse(
      localStorage.getItem("correctionpaper")
    );
    // console.log($scope.correctionpaperinfo)

    $scope.paperpathfinal = $scope.correctionpaperinfo.filepath;
    $scope.pdfUrl = $scope.paperpathfinal;
    $scope.selected_ques_paper_code = $scope.correctionpaperinfo.papercode
    // $scope.pdfUrl = "http://10.60.1.22/~ram/VEERESH_WORKS/digival_testing/240371505005.pdf";
    // $scope.correctionpaperinfo.papercode = 250118441170329;
    // // console.log($scope.pdfUrl)

    var touchstone_api =
      "https://touchstone.aditya.ac.in/degree/v23/touchstoneapi";
    var apiurl = "https://w.aditya.ac.in/digival/api";
    //var touchstone_api = "http://10.70.3.30:4000"
    // var apiurl = "http://10.70.3.135:5006"
  // var apiurl = "http://localhost:5006"

    $scope.$broadcast("renderPage");

    $scope.$watch("numPages", function (newVal, oldVal) {
      $scope.total_no_of_pages = [];
      if (newVal != 0) {
        for (var i = 3; i <= newVal; i++) {
          $scope.total_no_of_pages.push(i);
        }
      }
    });

    var post_obj = {    
      examid : parseInt($scope.correctionpaperinfo.examid),    
      papercode : $scope.correctionpaperinfo.papercode,    
      campus : $scope.correctionpaperinfo.branch  
    }
  
    $http.post(apiurl + '/exammaster/getsubpapercode/', post_obj).then(function (data) {
      // console.log(data.data)
      if (data.data.length > 0) {
        $scope.correctionpaperinfo.papercode = data.data[0].papercode
        $scope.get_q_schema()
      }
  
    })

    
    $scope.get_q_schema = function () {
      // // console.log($scope.correctionpaperinfo)
      $http
        .get(
          touchstone_api +
          "/paperlayouts/qpaper/" +
          $scope.correctionpaperinfo.papercode
        )
        .then(function (data) {
          // // console.log(data.data)
          $scope.no_of_question = data.data.paperinfo.TotalNoOfQuestions;
          $scope.total_questios = data.data.layoutinfo;
          // // console.log($scope.total_questios);

          function calculateTotals() {
            $scope.total_questios.forEach((section) => {
              if (section.subsections && Array.isArray(section.subsections)) {
                let sectionTotal = 0;
                section.subsections.forEach((subsection) => {
                  if (
                    subsection.Questions &&
                    Array.isArray(subsection.Questions)
                  ) {
                    subsection.Questions.forEach((question) => {
                      if (question.applied_marks !== undefined) {
                        sectionTotal += question.applied_marks * 1;
                      }
                    });
                  }
                });
                section.total = sectionTotal;
              }
              //// console.log(section.total);
            });

            $scope.grandTotal = $scope.total_questios.reduce(
              (sum, section) => sum + (section.total || 0),
              0
            );
          }

          calculateTotals();

          $scope.$watch(
            "total_questios",
            function (newVal, oldVal) {
              if (newVal !== oldVal) {
                calculateTotals();
              }
            },
            true
          );

          var final_questions_info = [];
          for (var i = 0; i < $scope.total_questios.length; i++) {
            var questions_info = [];
            if ($scope.total_questios[i].SectionDivider != "or") {
              for (
                var j = 0;
                j < $scope.total_questios[i].subsections[0].Questions.length;
                j++
              ) {
                questions_info.push(
                  $scope.total_questios[i].subsections[0].Questions[j]
                );
              }
              final_questions_info.push(questions_info);
            } else {
              for (
                var j = 0;
                j < $scope.total_questios[i].subsections.length;
                j++
              ) {
                for (
                  var k = 0;
                  k < $scope.total_questios[i].subsections[j].Questions.length;
                  k++
                ) {
                  questions_info.push(
                    $scope.total_questios[i].subsections[j].Questions[k]
                  );
                }
              }
              final_questions_info.push(questions_info);
            }
          }

          final_questions_info = final_questions_info.flat();
          // // console.log(final_questions_info);
          $scope.qnos = final_questions_info;
          $scope.total_marks = getSumElements($scope.qnos, "Qmarks");
        });
    };


    $scope.selectQuestion = function (value) {
      // // console.log(value);
      $scope.selected_ques_obj = [value];
      $scope.selectedQuestionValue = value.Qlabel;
      $scope.selectedMarks = "";
      $scope.Qmarks = "";

      $("#sidebar").removeClass("active");
      $("#content").removeClass("active");
    };

    $scope.saveModifiedPDF = async function () {
      // // console.log($scope.total_questios)
      var obj = {
        campus: $scope.correctionpaperinfo.branch,
        subject: $scope.correctionpaperinfo.subject,
        examid: $scope.correctionpaperinfo.examid,
        papercode: $scope.selected_ques_paper_code,
        paycode: $scope.correctionpaperinfo.paycode,
        suc: $scope.correctionpaperinfo.suc,
        marksjson: $scope.total_questios,
      };
      // // console.log(obj)

      $http.post(apiurl + "/answerpapers/savemarks", obj).then(function (data) {
        $scope.save_marks = data.data;
        // // console.log($scope.save_marks)
      });

      $scope.$broadcast("savePdf");
    };

    $scope.on_cursor_check = function (dt) {
      // // console.log(dt);
      if (dt.applied_marks > dt.Qmarks) {
        alert("Marks must below or equals to " + dt.Qmarks);
      }
    };

    $scope.choice_marks_check = function (dt) {
      // // console.log(dt);

      if (!dt.Questions || dt.Questions.length === 0) return;

      // Find the object with the highest applied_marks, considering only objects that have applied_marks
      let highestAppliedMarksObj = dt.Questions
        .filter(obj => obj.hasOwnProperty('applied_marks')) // Only consider objects that have 'applied_marks'
        .reduce((max, obj) => obj.applied_marks > max.applied_marks ? obj : max, { applied_marks: 0 });

      // Update heighest_choice only for objects with applied_marks
      dt.Questions.forEach(obj => {
        if (obj.hasOwnProperty('applied_marks')) {
          obj.heighest_choice = obj === highestAppliedMarksObj;
        }
      });

      
      if (highestAppliedMarksObj.applied_marks > highestAppliedMarksObj.Qmarks) {
        alert("Marks must below or equals to " + highestAppliedMarksObj.Qmarks);
        highestAppliedMarksObj.applied_marks = 0
      }

      // // console.log(dt.Questions);
    };

    $scope.getHighestAppliedMarks = function (questions) {
      if (!questions || questions.length === 0) return 0;
      return Math.max(...questions.map(q => q.applied_marks || 0));
    };
    
    $scope.gotohome = function () {
      location.href = `index.html`;
    };

    $scope.drawMode = function () {
      $scope.drawingMode = !$scope.drawingMode;
      if ($scope.drawingMode) {
        $scope.deletemode = false;
      }
    };
    $scope.undo = function () {
      // This function is now implemented in the directive
    };

    $scope.eraser = function () {
      $scope.deletemode = !$scope.deletemode;
      if ($scope.deletemode) {
        $scope.drawingMode = false;
      }
    };
    $scope.get_page = function (page) {
      $scope.pageNum = page;
      if (!$scope.visitedPages.includes(page)) {
        $scope.visitedPages.push(page);
        // // console.log($scope.visitedPages)
      }
      $scope.$broadcast("renderPage");
    };
    $scope.nextPage = function () {
      if ($scope.pageNum < $scope.numPages) {
        $scope.pageNum++;
        if (!$scope.visitedPages.includes($scope.pageNum)) {
          $scope.visitedPages.push($scope.pageNum);
          //  // console.log($scope.visitedPages)
        }
        $scope.$broadcast("renderPage");
      }
      $scope.selected_ques_obj = [];
    };
    $scope.initVisitedPages = function () {
      if (!$scope.visitedPages.includes($scope.pageNum)) {
        $scope.visitedPages.push($scope.pageNum);
      }
      $scope.$broadcast("renderPage");
    };

    $scope.initVisitedPages();

    $scope.previousPage = function () {
      if ($scope.pageNum > 1) {
        $scope.pageNum--;
        if (!$scope.visitedPages.includes($scope.pageNum)) {
          $scope.visitedPages.push($scope.pageNum);
          // // console.log($scope.visitedPages)
        }
        $scope.$broadcast("renderPage");
      }
      // $scope.selected_ques_obj = [];
    };

    $scope.savePdf = function () {
      $scope.$broadcast("savePdf");
    };

    function getSumElements(obj, field) {
      var total = 0;
      for (var i in obj) total += Number(obj[i][field]);
      return total;
    }
  }
);

app.filter("trust", [
  "$sce",
  function ($sce) {
    return function (value) {
      return $sce.trustAsHtml(value.replace('/""/g', ""));
    };
  },
]);