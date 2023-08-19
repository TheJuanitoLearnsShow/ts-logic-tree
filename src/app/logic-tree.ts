export type DecisionAction = {
    readonly label: string
    readonly actionId: string
}

export type DecisionStep = {
    readonly actions: DecisionAction[]
    readonly verbiage: string
    readonly children: DecisionStep[]
    readonly decisionId: string
}

export type NewDecisionStepEvent = {
    readonly newStep: DecisionStep
    readonly onActionSelected: (actionId: string) => void
    readonly onGoBack: (() => void)
}

export class LogicTreeEngine {
    private currStep: DecisionStep
    private prevSteps: DecisionStep[]

    constructor(readonly listener: (newStep: NewDecisionStepEvent) => void) {
    }

    run(rootDecision: DecisionStep) {
        this.currStep = rootDecision
        this.prevSteps = []
        this.listener({
            newStep: this.currStep,
            onActionSelected: (actionId: string) => this.nextAction(actionId),
            onGoBack: null
        })
    }

    private nextAction(actionId: string) {
        const nextStep = this.currStep.children.filter(c => c.decisionId == actionId)[0]
        this.prevSteps.push(this.currStep)
        this.currStep = nextStep
        this.listener({
            newStep: this.currStep,
            onActionSelected: (actionId: string) => this.nextAction(actionId),
            onGoBack: () => this.goBack()
        })
    }


    private goBack() {
        this.currStep = this.prevSteps.pop()
        this.listener({
            newStep: this.currStep,
            onActionSelected: (actionId: string) => this.nextAction(actionId),
            onGoBack: this.prevSteps.length > 0? () => this.goBack() : null
        })
    }
}