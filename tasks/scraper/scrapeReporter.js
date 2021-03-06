var alertMailer = require('./../alertMailer').mailer;
var util = require('./../util');
var _ = require('underscore');
var $ = require('jquery');

var blankReportInfo = {
  GENERAL : {
    NAME : 'General',
    INFO : []
  },
  RACE : {
    NAME : 'Races',
    INFO : []
  },
  RESULT : {
    NAME : 'Results',
    INFO : []
  },
  TEAM : {
    NAME : 'Teams',
    INFO : []
  },
  DIVISION : {
    NAME : 'Divisions',
    INFO : []
  },
  DATA : {
    NAME : 'Data',
    INFO : []
  }
};

var resetReportInfo = function () {
  reportInfo = $.extend(true, {}, blankReportInfo);
};

var getFormattedReport = function () {
  var report = '<h1>Scrape Report</h1>';
  _.each(reportInfo, function (section, key) {
    report += '<h2>' + section.NAME + '</h2>';
    if (_.isEmpty(section.INFO)) {
      report += '<p>None</p>';
    } else {
      _.each(section.INFO, function (message) {
        message = message.replace('\n', '<br>');
        report += '<p>' + message + '</p>';
      });
    }
  });
  return report;
};

var reportInfo = $.extend(true, {}, blankReportInfo);
var noMail = util.getEnvVar('NO_MAIL');

exports.addRaceInfo = function (message) {
  reportInfo.RACE.INFO.push(message);
};

exports.addResultInfo = function (message) {
  reportInfo.RESULT.INFO.push(message);
};

exports.addTeamInfo = function (message) {
  reportInfo.TEAM.INFO.push(message);
};

exports.addDivisionInfo = function (message) {
  reportInfo.DIVISION.INFO.push(message);
};

exports.addDataInfo = function (message) {
  reportInfo.DATA.INFO.push(message);
};

exports.addGeneralInfo = function (message) {
  reportInfo.GENERAL.INFO.push(message);
};

exports.sendReport = function () {
  if (!noMail) {
    alertMailer.send({
      subject : 'Scrape Report',
      html : getFormattedReport()
    });
  }
  resetReportInfo();
};
