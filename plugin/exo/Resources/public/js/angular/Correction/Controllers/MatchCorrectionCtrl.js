/**
 * Correction for Match Questions
 * @param {QuestionService}      QuestionService
 * @param {MatchQuestionService} MatchQuestionService
 * @constructor
 */
var MatchCorrectionCtrl = function MatchCorrectionCtrl(QuestionService) {
    AbstractCorrectionCtrl.apply(this, arguments);

    this.MatchQuestionService = MatchQuestionService;
};

// Extends AbstractQuestionCtrl
MatchCorrectionCtrl.prototype = Object.create(AbstractCorrectionCtrl.prototype);

// Set up dependency injection (get DI from parent too)
MatchCorrectionCtrl.$inject = AbstractCorrectionCtrl.$inject.concat([ 'MatchQuestionService' ]);


MatchCorrectionCtrl.prototype.studentAnswers = [];
MatchCorrectionCtrl.prototype.correctAnswers = [];
MatchCorrectionCtrl.prototype.orphanAnswers = [];
MatchCorrectionCtrl.prototype.studentErrors = [];

MatchCorrectionCtrl.prototype.init = function () {
    this.setCorrectAnswers();
};

/**
 * Checks the validity of proposals associated with one label
 * @param {type} label
 * @returns {Boolean}
 */
MatchCorrectionCtrl.prototype.checkAnswerValidity = function (label) {
    var errors = [];
    // studentProposalsForLabel
    var studentProposalsForLabel = this.getStudentAnswers(label);
    var correctProposalsForLabel = this.getCorrectAnswers(label);
    if (studentProposalsForLabel === undefined && correctProposalsForLabel && correctProposalsForLabel.length > 0) {
        return correctProposalsForLabel.length === 0;
    } else if (studentProposalsForLabel !== undefined) {
        // CASE 1 : no answers but expected ones
        if (studentProposalsForLabel.length === 0 && correctProposalsForLabel.length > 0) {
            return false;
        }
        // CASE 2 : answers from student, check that answers are in expected ones
        // search for corresponding student proposal in solution
        for (var i = 0; i < studentProposalsForLabel.length; i++) {
            var found = false;
            var searched = studentProposalsForLabel[i].id;
            // answer not in proposals
            for (var j = 0; j < correctProposalsForLabel.length; j++) {
                if (correctProposalsForLabel[j].id === searched) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                errors.push(searched);
            }
        }
        // keep wrong assocations for later use (apply line-through style to unexpected element in student answers)
        this.studentErrors = errors;

        // CASE 3 : missing answers from student
        if (studentProposalsForLabel.length < correctProposalsForLabel.length) {
            return false;
        }
    }
    return errors.length === 0;
};

MatchCorrectionCtrl.prototype.setStudentAnswers = function () {
    for (var i = 0; i < this.question.secondSet.length; i++) {
        var label = this.question.secondSet[i];
        var studentProposals = this.getStudentProposalsForLabel(label);
        var item = {
            label: label,
            proposals: studentProposals[0]
        };
        this.studentAnswers.push(item);
    }
};

MatchCorrectionCtrl.prototype.getStudentAnswers = function (label) {
    for (var i = 0; i < this.studentAnswers.length; i++) {
        if (label.id === this.studentAnswers[i].label.id) {
            return this.studentAnswers[i].proposals;
        }
    }
};

/**
 * Build an array of proposals that should be associated to a label
 * Some proposals can have no corresponding label !!!
 * @returns {undefined}
 */
MatchCorrectionCtrl.prototype.setCorrectAnswers = function () {
    for (var i = 0; i < this.question.secondSet.length; i++) {
        var label = this.question.secondSet[i];
        var solutions = this.getSolutionProposalsForLabel(label);
        var item = {
            label: label,
            proposals: solutions
        };
        this.correctAnswers.push(item);
    }
};

MatchCorrectionCtrl.prototype.getCorrectAnswers = function (label) {
    for (var i = 0; i < this.correctAnswers.length; i++) {
        if (label.id === this.correctAnswers[i].label.id) {
            return this.correctAnswers[i].proposals;
        }
    }
};


MatchCorrectionCtrl.prototype.getStudentProposalsForLabel = function (label) {
    var results = [];

    var answers = this.paper.answer;
    var formatted = this.formatStudentAnswers(answers, label);
    results.push(formatted);

    return results;
};
/**
 * Get label associated proposals
 * Also build an array of orphan proposals
 * @param {Object} label
 * @returns {Array} composed by associated proposals for a given label
 */
MatchCorrectionCtrl.prototype.getSolutionProposalsForLabel = function (label) {
    var results = [];
    this.orphanAnswers = [];
    for (var i = 0; i < this.question.solutions.length; i++) {
        if (this.question.solutions[i].secondId === label.id) {
            var proposal = this.getProposalFromId(this.question.solutions[i].firstId);
            results.push(proposal);
        } else if (!this.question.solutions[i].secondId) {
            var proposalWithoutLabel = this.getProposalFromId(this.question.solutions[i].firstId);
            this.orphanAnswers.push(proposalWithoutLabel);
        }
    }
    return results;
};

MatchCorrectionCtrl.prototype.formatStudentAnswers = function (answers, label) {
    var formatted = [];
    for (var j = 0; j < answers.length; j++) {
        var set = answers[j].split(',');
        var proposalId = set[0];
        var associatedLabelId = set[1];
        if (associatedLabelId === label.id) {
            var proposal = this.getProposalFromId(proposalId);
            formatted.push(proposal);
        }
    }
    return formatted;
};

MatchCorrectionCtrl.prototype.getProposalFromId = function (id) {
    for (var k = 0; k < this.question.firstSet.length; k++) {
        if (this.question.firstSet[k].id === id) {
            return this.question.firstSet[k];
        }
    }
};

/**
 * Checks that a proposal is in the studentErrors array
 * if found we apply line-through style on the label to ease error visualisations.
 * @param {type} proposalId
 * @returns {Boolean} true if proposal is valid else false
 */
MatchCorrectionCtrl.prototype.checkProposalValidity = function (proposalId) {
    for (var i = 0; i < this.studentErrors.length; i++) {
        if (this.studentErrors[i] === proposalId) {
            return false;
        }
    }
    return true;
};

/**
 * While rendering each question label and answers get feedback if exists
 * @param   {Object} label
 * @returns {String} choice feedback
 */
MatchCorrectionCtrl.prototype.getCurrentItemFeedBack = function (label) {
    for (var i = 0; i < this.question.solutions.length; i++) {
        if (this.question.solutions[i].secondId === label.id) {
            return this.question.solutions[i].feedback !== '' && this.question.solutions[i].feedback !== undefined ? this.question.solutions[i].feedback : '-';
        }
    }
};

// Register controller into AngularJS
angular
    .module('Correction')
    .controller('MatchCorrectionCtrl', MatchCorrectionCtrl);
