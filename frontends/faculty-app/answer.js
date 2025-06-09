// app.js
var app = angular.module('pdfAnnotationApp', []);

app.controller('answersheetController', function ($http, $scope, $sce, $timeout) {
  $scope.pageNum = 3;
  $scope.deleteradius = 50;
  $scope.annotations = [];
  $scope.selected_ques_obj = [];
  $scope.total_no_of_pages = 0;
  $scope.visitedPages = [];
  $scope.pdfload = 0;

  $scope.correctionpaperinfo = JSON.parse(localStorage.getItem("correctionpaper"));
  //  console.log($scope.correctionpaperinfo)
  $scope.paperpathfinal = $scope.correctionpaperinfo.filepath.replace("/uploads/", "/uploads/annotated_pdfs/");

  //console.log($scope.paperpathfinal)

  $scope.pdfUrl = $scope.paperpathfinal;
  //console.log($scope.pdfUrl)

  $scope.$broadcast('renderPage');

  $scope.$watch('numPages', function (newVal, oldVal) {
    $scope.total_no_of_pages = [];
    if (newVal != 0) {
      for (var i = 3; i <= newVal; i++) {
        $scope.total_no_of_pages.push(i);
      }
    }
  });

  $scope.gotohome = function () {
    location.href = `index.html`;
  }

  $scope.nextPage = function () {
    if ($scope.pageNum < $scope.numPages) {
      $scope.pageNum++;
      if (!$scope.visitedPages.includes($scope.pageNum)) {
        $scope.visitedPages.push($scope.pageNum);
        //  console.log($scope.visitedPages)
      }
      $scope.$broadcast('renderPage');
    }
    // $scope.selected_ques_obj = [];
  };

  $scope.previousPage = function () {
    if ($scope.pageNum > 1) {
      $scope.pageNum--;
      if (!$scope.visitedPages.includes($scope.pageNum)) {
        $scope.visitedPages.push($scope.pageNum);
        // console.log($scope.visitedPages)
      }
      $scope.$broadcast('renderPage');

    }
    // $scope.selected_ques_obj = [];
  };

});

app.filter('trust', [
  '$sce',
  function ($sce) {
    return function (value) {
      return $sce.trustAsHtml(value.replace('/""/g', ''));
    }
  }
]);