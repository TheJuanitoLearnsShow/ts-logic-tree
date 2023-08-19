type DecisionAction = {
    readonly label: string
    readonly actionId: string
}

type DecisionStep = {
    readonly actions: DecisionAction[]
    readonly verbiage: string
    readonly children: DecisionStep[]
    readonly decisionId: string
}

type NewDecisionStepEvent = {
    readonly newStep: DecisionStep
    readonly onActionSelected: (actionId: string) => void
    readonly onGoBack: (() => void)
}

class LogicTreeEngine {
    private currStep: DecisionStep
    private prevSteps: DecisionStep[]

    constructor(readonly listener: (newStep: NewDecisionStepEvent) => void) {
    }

    run(rootDecision: DecisionStep,) {
        this.currStep = rootDecision
        this.prevSteps = []
        this.listener({
            newStep: this.currStep,
            onActionSelected: this.nextAction,
            onGoBack: null
        })
    }

    private nextAction(actionId: string) {
        const nextStep = this.currStep.children.filter(c => c.decisionId == actionId)[0]
        this.prevSteps.push(this.currStep)
        this.currStep = nextStep
        this.listener({
            newStep: this.currStep,
            onActionSelected: this.nextAction,
            onGoBack: this.goBack
        })
    }


    private goBack() {
        this.currStep = this.prevSteps.pop()
        this.listener({
            newStep: this.currStep,
            onActionSelected: this.nextAction,
            onGoBack: this.prevSteps.length > 0? this.goBack : null
        })
    }
}