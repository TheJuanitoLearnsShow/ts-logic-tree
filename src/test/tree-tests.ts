import {describe} from 'mocha';
import { equal } from "assert";
import {LogicTreeEngine, NewDecisionStepEvent, DecisionStep} from "../app/logic-tree";

const sampleFlow: DecisionStep = {
    decisionId: 'start',
    verbiage: 'Hello!',
    actions: [
        {actionId: 'acceptGreeting', label: 'Accept'},
        {actionId: 'rejectGreeting', label: 'Reject'}
    ],
    children: [
        {
            decisionId: 'rejectGreeting',
            verbiage: 'No problem, bye!',
            actions: [],
            children: []
        },
        {
            decisionId: 'acceptGreeting',
            verbiage: 'I am glad you accepted my greeting, Do you want water?',
            actions: [
                {actionId: 'yesWater', label: 'Yes'},
                {actionId: 'maybeWater', label: 'Maybe'},
                {actionId: 'noWater', label: 'No'}
            ],
            children: [
                {
                    decisionId: 'yesWater',
                    verbiage: 'Here is your water',
                    actions: [],
                    children: []
                }, {
                    decisionId: 'maybeWater',
                    verbiage: 'OK, we will wait',
                    actions: [],
                    children: []
                }, {
                    decisionId: 'noWater',
                    verbiage: 'No problem, have a good day',
                    actions: [],
                    children: []
                }
            ]
        }
    ]
}
describe('LogicTreeEngine', () => {
    describe('test a sample flow', () => {
        it('a flow reaches all the way to end', () => {
            let currStep:DecisionStep = null
            let sequenceSteps = ['start', 'acceptGreeting', 'yesWater'].reverse()
            function listener(ev: NewDecisionStepEvent) {
                currStep = ev.newStep
                console.log('Verbiage: ' + currStep.verbiage)
                equal(currStep.decisionId, sequenceSteps.pop())
                
                if (currStep.actions.length > 0) {
                    const nextAction = currStep.actions[0].actionId
                    console.log('Going to: ' + currStep.verbiage)
                    ev.onActionSelected(nextAction)
                }
            }

            let engine = new LogicTreeEngine(listener);
            engine.run(sampleFlow)
        });
    });
});