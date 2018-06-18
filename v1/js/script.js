$(function() {
  processData(transactions);
  drawPieChart("#flot-pie-chart", expences)
  $("#total-income").text(formatNumber(totalIncome));
  $("#total-spent").text(formatNumber(totalSpent));
  drawTable("#table-spent", expences);
  setFilters("#filter-tags", "#filter-tag-current", incomes, expences);
});

var incomes = [],  expences = [];
var tags = [];
var totalIncome = 0, totalSpent = 0;
var startDate, endDate;

function processData(t) {
  var o = {},
    a = [],
    i, e, j, f;
  for (i = 0; e = t[i]; i++) {
    for (j = 0; f = e.tags[j]; j++) {
      f = f.toLowerCase();
      o[f] = o[f] ? o[f] + e.amount : e.amount;
      if (j == 0) {
        if (e.amount > 0) totalIncome += e.amount;
        if (e.amount < 0) totalSpent += e.amount;
      }
    }
  };
  for (e in o) {
    if (o[e] > 0) {
      incomes.push({
        label: e,
        data: o[e]
      });
    } else {
      expences.push({
        label: e,
        data: o[e]
      });
    }
  };
  incomes.sort(sortData);
  expences.sort(sortData);
  return a;
}

function sortData(a, b) {
  return (Math.abs(a.data) < Math.abs(b.data)) ? 1 : -1;
}

const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

//Flot Pie Chart
function drawPieChart(layer_id, data) {
  var plotObj = $.plot($(layer_id), data, {
    series: {
      pie: {
        show: true
      }
    },
    grid: {
      hoverable: false
    },
    legend: {
      show: true,
      //labelFormatter: null or(fn: string, series object - > string)
      labelBoxBorderColor: null,//"#000000",
      position: "nw"
//      margin: 0,
//      backgroundColor: //"#000088",
//      backgroundOpacity: .5
    }
    /*
    tooltip: true,
    tooltipOpts: {
        content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
        shifts: {
            x: 20,
            y: 0
        },
        defaultTheme: false
    }*/
  });
};

function drawTable(id, data) {
  for (var i = 0; i < data.length; i++) {
    $(id).append("<tr><td>" + formatNumber(data[i].data) + "</td><td><div style='width:" + (Math.abs(totalSpent) > 0 ? 100 * data[i].data / totalSpent : 0) + "%; background-color:#dd9;'>" + data[i].label + "</div></td></tr>");
  }
}

function setFilters(id, choosen_id, incomes, expences) {
  for (var i = 0; i < incomes.length; i++){
    $(id).append("<li class='filter-tag' data-tag='" + incomes[i].label + "' data-amount='" + incomes[i].data + "'><a>#" + incomes[i].label + "</a></li>");
  }
  $(id).append('<li role="separator" class="divider"></li>');
  for (var i = 0; i < expences.length; i++){
    $(id).append("<li class='filter-tag' data-tag='" + expences[i].label + "' data-amount='" + expences[i].data + "'><a>#" + expences[i].label + "</a></li>");
  }
  $(".filter-tag").click(function () {
    $(choosen_id).text("#" + $(this).data("tag") + " (total: "  + $(this).data("amount") + ")")
    refreshTransactions($(this).data("tag"));
  })
}

function refreshTransactions(tag) {
  $("#table-transactions").empty();
  var t, _tag
  for (var i = 0; i < transactions.length, t = transactions[i]; i++){
    for (var j = 0; j < t.tags.length, _tag = t.tags[j]; j++){
      if (_tag.toLowerCase() == tag) {
        $("#table-transactions").append(
          "<tr><td>" + t.datetime + "</td>" +
          "<td>" + t.amount + "</td>" +
          "<td>" + tag + "</td>" +
          "<td>" + t.comment + "</td>" +
          "<td>" + t.user + "</td></tr>");
      }
    }
  }
}

//Flot Multiple Axes Line Chart
function drawLineChart() {
  var oilprices = [
    [1220392800000, 109.35],
    [1220565600000, 106.23],
    [1220824800000, 106.34]
  ];
  var exchangerates = [
    [1220738400000, 0.70120],
    [1220824800000, 0.7010],
    [1220911200000, 0.70050]
  ];

  function euroFormatter(v, axis) {
    return v.toFixed(axis.tickDecimals) + "€";
  }

  function doPlot(position) {
    $.plot($("#flot-line-chart-multi"), [{
      data: oilprices,
      label: "Oil price ($)"
    }, {
      data: exchangerates,
      label: "USD/EUR exchange rate",
      yaxis: 2
    }], {
      xaxes: [{
        mode: 'time'
      }],
      yaxes: [{
        min: 0
      }, {
        // align if we are to the right
        alignTicksWithAxis: position == "right" ? 1 : null,
        position: position,
        tickFormatter: euroFormatter
      }],
      legend: {
        position: 'sw'
      },
      grid: {
        hoverable: true //IMPORTANT! this is needed for tooltip to work
      },
      tooltip: true,
      tooltipOpts: {
        content: "%s for %x was %y",
        xDateFormat: "%y-%0m-%0d",

        onHover: function(flotItem, $tooltipEl) {
          // console.log(flotItem, $tooltipEl);
        }
      }

    });
  }

  doPlot("right");

  $("button").click(function() {
    doPlot($(this).text());
  });
};

//Flot Bar Chart

function drawBarChart() {

  var barOptions = {
    series: {
      bars: {
        show: true,
        barWidth: 43200000
      }
    },
    xaxis: {
      mode: "time",
      timeformat: "%m/%d",
      minTickSize: [1, "day"]
    },
    grid: {
      hoverable: true
    },
    legend: {
      show: false
    },
    tooltip: true,
    tooltipOpts: {
      content: "x: %x, y: %y"
    }
  };
  var barData = {
    label: "bar",
    data: [
      [1354521600000, 1000],
      [1355040000000, 2000],
      [1355223600000, 3000],
      [1355306400000, 4000],
      [1355487300000, 5000],
      [1355571900000, 6000]
    ]
  };
  $.plot($("#flot-bar-chart"), [barData], barOptions);

};


var transactions = [{
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -110.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -270.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -70.00,
    'tags': ['ОбщТранспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -180.00,
    'tags': ['Каршеринг']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -110.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -210.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -210.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -100.00,
    'tags': ['Связь']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -11500.00,
    'tags': ['Кредит']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -1100.00,
    'tags': ['Бухло']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -1699.00,
    'tags': ['Подарки']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -163.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -108.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -2762.00,
    'tags': ['Продукты']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -30000.00,
    'tags': ['Путешествия']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -55.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -128.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -128.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -128.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -1400.00,
    'tags': ['Развлечения']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -200.00,
    'tags': ['Продукты']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -290.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,4506944444',
    'user': 'stepanovceo',
    'amount': -820.00,
    'tags': ['Бухло']
  },
  {
    'datetime': '43264,5118055556',
    'user': 'stepanovceo',
    'amount': -70.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43264,5138888889',
    'user': 'stepanovceo',
    'amount': -270.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,5395833333',
    'user': 'stepanovceo',
    'amount': 100000.00,
    'tags': ['DigitalBudget']
  }, {
    'datetime': '43264,5402777778',
    'user': 'stepanovceo',
    'amount': -150.00,
    'tags': ['Продукты']
  }, {
    'datetime': '43264,8326388889',
    'user': 'stepanovceo',
    'amount': -1227.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43264,91875',
    'user': 'stepanovceo',
    'amount': -402.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43265,3791666667',
    'user': 'stepanovceo',
    'amount': -162.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43265,4416666667',
    'user': 'stepanovceo',
    'amount': -110.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43265,7229166667',
    'user': 'stepanovceo',
    'amount': -6000.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43265,7236111111',
    'user': 'stepanovceo',
    'amount': 2500.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43266,4013888889',
    'user': 'stepanovceo',
    'amount': -4000.00,
    'tags': ['Коммуналка']
  }, {
    'datetime': '43266,4013888889',
    'user': 'stepanovceo',
    'amount': -5000.00,
    'tags': ['Штрафы']
  }, {
    'datetime': '43266,4020833333',
    'user': 'stepanovceo',
    'amount': -649.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43266,4020833333',
    'user': 'stepanovceo',
    'amount': -102.00,
    'tags': ['Транспорт']
  }, {
    'datetime': '43266,4833333333',
    'user': '257448948',
    'amount': -500.00,
    'tags': ['транспорт']
  }, {
    'datetime': '43266,4833333333',
    'user': '257448948',
    'amount': -4800.00,
    'tags': ['здоровье']
  }, {
    'datetime': '43266,54375',
    'user': 'stepanovceo',
    'amount': -299.00,
    'tags': ['ЕдаВнеДома']
  }, {
    'datetime': '43266,5583333333',
    'user': 'stepanovceo',
    'amount': -299.00,
    'tags': ['ЕдаВнеДома']
  },
]
