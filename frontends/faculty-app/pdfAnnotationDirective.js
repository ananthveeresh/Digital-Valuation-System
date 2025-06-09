app.directive('pdfAnnotation', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var canvas = element[0];
      var ctx = canvas.getContext('2d');
      var pdfDoc = null;
      var isDrawing = false;
      var lastX = 0;
      var lastY = 0;

      //var apiurl = "http://10.70.3.135:5006"
      var apiurl = "https://w.aditya.ac.in/digival/api"

      scope.correctionpaperinfo = JSON.parse(localStorage.getItem("correctionpaper"));
      // console.log(scope.correctionpaperinfo)

      function resizeCanvas() {
        canvas.width = element.parent()[0].clientWidth;
      }

      angular.element($window).on('resize', resizeCanvas);
      resizeCanvas();

      // console.log(scope.pdfUrl)
      pdfjsLib.getDocument(scope.pdfUrl).promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        scope.numPages = pdfDoc.numPages;
        scope.$apply();
        // console.log(scope.numPages)
        renderPage(scope.pageNum);
      });

      function renderPage(num) {
        if (num === 1 || num === 2) {
          scope.pageNum = 3;
          num = 3;
        }
        pdfDoc.getPage(num).then(function (page) {
          var viewport = page.getViewport({
            scale: canvas.width / page.getViewport({ scale: 1 }).width,
          });
          canvas.height = viewport.height;

          var renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };

          page.render(renderContext).promise.then(function () {
            redrawAnnotations();
          });
        });
      }

      function redrawAnnotations() {

        scope.annotations.forEach(function (annotation) {
          if (annotation.page === scope.pageNum) {
            if (annotation.type === 'line') {
              drawLineAnnotation(ctx, annotation);
            } else if (annotation.type === 'marks') {
              drawMarksAnnotation(ctx, annotation);
            }
          }
        });
      }

      function drawLineAnnotation(ctx, annotation) {
        ctx.beginPath();
        ctx.moveTo(annotation.startX, annotation.startY);
        ctx.lineTo(annotation.endX, annotation.endY);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      function drawMarksAnnotation(ctx, annotation) {
        var x = annotation.startX;
        var y = annotation.startY;
        var radius = 55;

        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "transparent";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();

        // Draw question number
        var q = `Q: ${annotation.question}`;
        ctx.font = "20px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(q, x - 20, y - 30);

        // Draw red line
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 40, y - 20);
        ctx.lineTo(x + 40, y - 20);
        ctx.stroke();

        // Draw "Marks" text
        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Marks", x - 20, y);
        var qmarks = annotation.Qmarks || scope.selectedQMarks;
        // Draw marks
        var text = `${annotation.marks} / ${qmarks}`;
        ctx.font = "28px Arial";
        ctx.fillStyle = "green";
        ctx.clearRect(x - 25, y, 30, 30);
        ctx.fillText(text, x - 25, y + 30);
      }

      scope.undo = function () {
        if (scope.annotations.length > 0) {
          for (var i = scope.annotations.length - 1; i >= 0; i--) {
            if (scope.annotations[i].page === scope.pageNum) {
              scope.annotations.splice(i, 1);
              break;
            }
          }
          renderPage(scope.pageNum);
        }
      };

      scope.eraser = function () {
        scope.deletemode = !scope.deletemode;
        if (scope.deletemode) {
          scope.drawingMode = false; // Disable drawing mode when delete mode is enabled
        }
      };

      function eraseannotvalues(x, y) {
        var targetPage = scope.pageNum;
        var yleast = y - scope.deleteradius;
        var yhighest = y + scope.deleteradius;
        var xleast = x - scope.deleteradius;
        var xhighest = x + scope.deleteradius;

        var filteredArr = scope.annotations.filter(function (obj) {
          return !(obj.page === targetPage && obj.startY >= yleast && obj.startY <= yhighest && obj.startX >= xleast && obj.startX <= xhighest);
        });

        scope.annotations = filteredArr

        renderPage(scope.pageNum);
      }

      element.on('mousedown touchstart', function (e) {
        if (scope.drawingMode) {
          isDrawing = true;
          var pos = getPosition(e);
          [lastX, lastY] = [pos.x, pos.y];
        }
      });

      element.on('mousemove touchmove', function (e) {

        if (!isDrawing) return;
        var pos = getPosition(e);
        drawLineAnnotation(ctx, {
          startX: lastX,
          startY: lastY,
          endX: pos.x,
          endY: pos.y
        });
        scope.annotations.push({
          page: scope.pageNum,
          type: 'line',
          startX: lastX,
          startY: lastY,
          endX: pos.x,
          endY: pos.y,
        });
        [lastX, lastY] = [pos.x, pos.y];
        if (e.type === 'touchmove') {
          e.preventDefault();
        }
      });

      element.on('mouseup mouseout touchend touchcancel', function () {
        isDrawing = false;
      });

      element.on('click', function (event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        if (scope.deletemode) {
          eraseannotvalues(x, y)
        }

        if (!scope.addingMarks) return;

        var annotation = {
          page: scope.pageNum,
          type: 'marks',
          startX: x,
          startY: y,
          question: scope.selectedQuestionValue,
          marks: scope.selectedMarks,
          Qmarks: scope.selectedQMarks,

        };
        // console.log(annotation)

        scope.annotations.push(annotation);
        drawMarksAnnotation(ctx, annotation);
        scope.addingMarks = false;
        scope.$apply();
      });

      function getPosition(e) {
        var rect = canvas.getBoundingClientRect();
        if (e.type.startsWith('touch')) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
          };
        } else {
          return {
            x: e.offsetX,
            y: e.offsetY
          };
        }
      }

      scope.$on('renderPage', function () {
        renderPage(scope.pageNum);
      });

      scope.$on('savePdf', function () {
        savePdf();
      });

      async function savePdf() {
        const saveButton = document.getElementById('save-pdf-button');
        const loadingButton = document.getElementById('loading-button');
        const successMessage = document.getElementById('success-message');

        saveButton.style.display = 'none';
        loadingButton.style.display = 'inline-block';
        const existingPdfBytes = await fetch(scope.pdfUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        for (let i = 1; i <= pdfDoc.getPageCount(); i++) {
          const page = pdfDoc.getPage(i - 1);
          const { width, height } = page.getSize();

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext("2d");

          scope.annotations.forEach((annotation) => {
            if (annotation.page === i) {
              if (annotation.type === 'marks') {
                annotation.startX = annotation.startX - 15;
                annotation.startY = annotation.startY - 35;
                drawMarksAnnotation(tempCtx, annotation, width, height);
              } else {
                const startX = (annotation.startX / canvas.width) * width;
                const startY = (annotation.startY / canvas.height) * height;
                const endX = (annotation.endX / canvas.width) * width;
                const endY = (annotation.endY / canvas.height) * height;

                tempCtx.beginPath();
                tempCtx.moveTo(startX, startY);
                tempCtx.lineTo(endX, endY);
                tempCtx.strokeStyle = "red";
                tempCtx.lineWidth = 3;
                tempCtx.stroke();
              }
            }
          });

          const image = await pdfDoc.embedPng(tempCanvas.toDataURL());

          page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
          });
        }

        const pdfBytes = await pdfDoc.save(); // Save the annotated PDF

        // Create FormData object to send the PDF and additional data
        const formData = new FormData();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        formData.append('pdfFile', pdfBlob, 'document.pdf');
        const response = await fetch(apiurl + '/answerpapers/savepdf/' + scope.correctionpaperinfo.branch + '/' + scope.correctionpaperinfo.examid + '/' + scope.correctionpaperinfo.papercode + '/' + scope.correctionpaperinfo.subject + '/' + scope.correctionpaperinfo.suc, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/pdf',
          },
          transformRequest: angular.identity,
          body: formData
        });

        const result = await response.text();
        // console.log(result);
        loadingButton.style.display = 'none';
        successMessage.style.display = 'inline-block';
        alert("Paper valuation submitted successfully..!")
        window.location.href = `index.html`; 
        // window.open('https://w.aditya.ac.in/dev/SUVARNA-WORKS/DigiVal/digival_pdfs/2327170138.pdf', '_blank', 'noopener, noreferrer');
      }

    }
  };
}]);