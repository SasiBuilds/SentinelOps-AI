def recover(action):

    if action == "restart deployment":
        return "Deployment restarted successfully"

    elif action == "restart pod":
        return "Pod restarted successfully"

    elif action == "scale deployment":
        return "Deployment scaled successfully"

    return "Manual intervention required"