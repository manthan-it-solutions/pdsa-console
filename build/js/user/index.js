
$(document).ready(function () {
  var totalMessages = 100;
  var submission = 30;
  var delivered = 45;
  var failed = 15;
  var pending = 10;

  var submissionPercent = (submission / totalMessages) * 100;
  var deliveredPercent = (delivered / totalMessages) * 100;
  var failedPercent = (failed / totalMessages) * 100;
  var pendingPercent = (pending / totalMessages) * 100;

  $('.Submission_bar').css('width', submissionPercent + '%');
  $('.Delivered_bar').css('width', deliveredPercent + '%');
  $('.Failed_bar').css('width', failedPercent + '%');
  $('.Pending_bar').css('width', pendingPercent + '%');

  // Update percentages text
  $('#submission_percent').text(Math.round(submissionPercent) + '%');
  $('#delivered_percent').text(Math.round(deliveredPercent) + '%');
  $('#failed_percent').text(Math.round(failedPercent) + '%');
  $('#pending_percent').text(Math.round(pendingPercent) + '%');
});


// new js
const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Aug-01', 'Aug-02', 'Aug-03', 'Aug-04', 'Aug-05', 'Aug-06', 'Aug-07', 'Aug-08', 'Aug-09', 'Aug-10'],
    datasets: [
      {
        label: 'Read',
        data: [1200, 1900, 3000, 500, 2000, 300, 400, 1500, 2500, 3200],
        backgroundColor: '#00acc1',
        borderWidth: 1
      },
      {
        label: 'Failed',
        data: [200, 500, 700, 100, 400, 100, 150, 300, 600, 900],
        backgroundColor: '#e53935',
        borderWidth: 1
      },
      {
        label: 'Delivered',
        data: [800, 1500, 2000, 400, 1800, 200, 300, 1200, 2100, 2800],
        backgroundColor: '#8cc751',
        borderWidth: 1
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 4000,
        ticks: {
          stepSize: 1000,
          callback: function (value) {
            if (value === 0 || value === 1000 || value === 2000 || value === 3000 || value === 4000) {
              return value;
            }
            return '';
          }
        }
      }
    }
  }
});



$(document).ready(function (){
  document.getElementById('Loader_contain').style.display = 'none';
});