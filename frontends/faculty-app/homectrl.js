var app = angular.module('correctionApp', []);

app.controller('homectrl', function ($http, $scope, $sce) {

   var apiurl = "https://w.aditya.ac.in/digival/api"
  // var apiurl = "http://10.70.3.135:5006"
  // var apiurl = "http://localhost:5006"

  if (!localStorage.getItem('empinfo')) {
    location.href = 'login.html';
  }
  $scope.empuniquecode = JSON.parse(localStorage.getItem('empinfo'));
  //  console.log($scope.empuniquecode)

  $http.get(apiurl + '/answerpapers/staffallotedpaper/' + $scope.empuniquecode.paycode).then(function (data) {
    $scope.staff_alloted_paper = data.data
    //console.log($scope.staff_alloted_paper)
    for (var i = 0; i < $scope.staff_alloted_paper.length; i++) {
      let result = $scope.staff_alloted_paper[i].filepath.replace("/app", "https://w.aditya.ac.in/digival/faculty");
      $scope.staff_alloted_paper[i].filepath = result
    }
    var unique_paper_code = getUniqeElements($scope.staff_alloted_paper, 'papercode')
    $scope.unique_papers = [];
    var obj = {};
    for (var i = 0; i < unique_paper_code.length; i++) {
      var filteredData = $scope.staff_alloted_paper.filter(e => e.papercode == unique_paper_code[i]);
      // console.log(filteredData)
      if (filteredData.length > 0) {
        obj = {
          "examid": filteredData[0].examid,
          "papercode": filteredData[0].papercode,
          "subject": filteredData[0].subject,
          "papersalloted": filteredData,
        }


        $scope.unique_papers.push(obj);
      }
    }

    // console.log($scope.unique_papers);
    for (var i = 0; i < $scope.unique_papers.length; i++) {
      var filter_name = $scope.unique_papers[i].papersalloted
      // console.log(filter_name)
      $scope.unique_papers[i].completed = filter_name.filter(e => e.marksjson.length > 0).length;
      $scope.unique_papers[i].completed_info = filter_name.filter(e => e.marksjson.length > 0);

      $scope.unique_papers[i].pending = filter_name.filter(e => e.marksjson.length == 0).length;
      $scope.unique_papers[i].pending_info = filter_name.filter(e => e.marksjson.length == 0);

    }


    // console.log($scope.unique_papers);

  })

  $scope.exam_form = 0
  $scope.completed_exam = function (dt) {
    $scope.exam_form = 1
    $scope.completed_info = dt.map(item => {
      const sucStr = item.suc;
      var maskedSuc = sucStr.slice(0, 6).replace(/\d/g, '*') + sucStr.slice(6)
      return {
        ...item,
        maskedsuc: maskedSuc
      };
    });;
    $scope.completed_msg = "no data found"
  }

  $scope.pending_exam = function (dt) {
    // console.log(dt)
    $scope.exam_form = 2
    $scope.pending_info = dt.map(item => {
      const sucStr = item.suc;
      var maskedSuc = sucStr.slice(0, 6).replace(/\d/g, '*') + sucStr.slice(6)
      return {
        ...item,
        maskedsuc: maskedSuc
      };
    });;
    $scope.pending_msg = "no data found";
    
    var post_obj = {
      "papercode": dt[0].papercode,
      "campus": dt[0].branch,
      "examid": parseInt(dt[0].examid)
    }
    $http.post(apiurl + '/exammaster/getbypapercode', post_obj).then(function (data) {
      // console.log(data.data);
      $scope.paper_model = data.data[0].papertype && data.data[0].papertype === 1 ? 1 : 0
      // console.log($scope.paper_model)
    })
  }
  
  $scope.get_correction_paper = function (paper_id) {
    // console.log(paper_id)
    localStorage.setItem("correctionpaper", JSON.stringify(paper_id))
    if ($scope.paper_model == 1) {
      location.href = "correction2.html"
    } else {
      location.href = "correction.html"
    }

  }

  $scope.createSession = function (dt) {
    // console.log(dt);
    dt.filepath = $scope.path_check(dt.filepath, dt.papercode)
    // console.log(dt.filepath);
    var post_obj = {
      "papercode": dt.papercode,
      "campus": dt.branch,
      "examid": parseInt(dt.examid)
    }
    $http.post(apiurl + '/exammaster/getbypapercode', post_obj).then(function (data) {
      // console.log(data.data)
      if (data.data.length > 0) {
        // $scope.correctionpaperinfo.papercode = data.data[0].papercode
        $scope.oldSubcode = dt.papercode; // Existing subcode in the URL
        $scope.newSubcode = data.data[0].papercode;
        $scope.paperpathfinal = dt.filepath.replace($scope.oldSubcode, $scope.newSubcode);
        // console.log($scope.paperpathfinal)
        dt.filepath = $scope.paperpathfinal
        localStorage.setItem('correctionpaper', JSON.stringify(dt));
        location.href = "answer.html"
      }
    })
  };

  
  $scope.path_check = function(dt, pp_code){
    // console.log(dt);
    var path_array = dt.split('/')
    // console.log(path_array);

    var req_path = path_array[8].split('-');
    // console.log(req_path);

    req_path[1] = pp_code;

    path_array[8] = req_path.join('-');
    // console.log(path_array);

    var path_update = path_array.join('/');
    // console.log(path_update);
    return path_update
  }

  $scope.marksdata = function (succode) {
    // console.log()
    $scope.std_suc_filter = $scope.completed_info.filter(e => e.maskedsuc == succode);
    //console.log($scope.std_suc_filter)

    var obj = {
      "examid": $scope.std_suc_filter[0].examid,
      "papercode": $scope.std_suc_filter[0].papercode,
      "suc": $scope.std_suc_filter[0].suc
    }
    //  console.log(obj)

    $http.post(apiurl + "/answerpapers/facultystudentmarks", obj).then(function (response) {
      $scope.marks_data = response.data[0];
      // console.log($scope.marks_data);

      $scope.calculateSubsectionTotal = function (questions) {
        let totalMarks = 0;

        questions.forEach(function (question) {
          if (question.score_status && question.applied_marks) {
            totalMarks += question.applied_marks;
          }
        });

        return totalMarks;
      };
    });

    $('#marksModal').modal('show');
  };

  $scope.calculatePartTotals = function () {
    if (!$scope.marks_data || !$scope.marks_data.marksjson) {
      console.error('marks_data or marks_data.marksjson is undefined');
      return;
    }
    $scope.sectionTotals = [];

    angular.forEach($scope.marks_data.marksjson, function (section) {
      let sectionTotal = 0;
      if (Array.isArray(section.subsections)) {
        angular.forEach(section.subsections, function (subsection) {
          sectionTotal += $scope.calculateSubsectionTotal(subsection.Questions);
        });
      } else if (section.subsections && Array.isArray(section.subsections.Questions)) {
        sectionTotal = $scope.calculateSubsectionTotal(section.subsections.Questions);
      }

      $scope.sectionTotals.push({
        sectionName: section.Section,
        total: sectionTotal
      });
    });

    // console.log($scope.sectionTotals); 
  };

  $scope.$watch('marks_data', function (newVal) {
    if (newVal) {
      $scope.calculatePartTotals();
    }
  });

  $scope.numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  $scope.closeModal = function () {
    $('#marksModal').modal('hide');
  };

  $scope.logOut = function () {
    localStorage.removeItem("empinfo")
    localStorage.removeItem("correctionpaper")
    window.location.href = `login.html`;
    location.reload()
  }

  function getUniqeElements(obj, field) {
    var elements = [];
    for (var i in obj) {
      if (elements.indexOf(obj[i][field]) == -1) {
        elements.push(obj[i][field]);
      }
    }
    return elements;
  }

});
app.filter('trust', [
  '$sce',
  function ($sce) {
    return function (value) {
      return $sce.trustAsHtml(value.replace('/""/g', ''));
    }
  }
]);