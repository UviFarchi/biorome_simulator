// ---------- Requirements helpers ----------
function assemblyMeetsRequirements(assembly, requirementType, requirementName) {
    if (!assembly || !Array.isArray(assembly.modules)) return false
    const requirementsRoot = getStore('assemblyRequirements')
    const requirementList =
        requirementsRoot[requirementType] && requirementsRoot[requirementType][requirementName]
            ? requirementsRoot[requirementType][requirementName]
            : []

    return requirementList.every((requirement) =>
        assembly.modules.some((module) =>
            (!requirement.type    || module.type    === requirement.type) &&
            (!requirement.subtype || module.subtype === requirement.subtype) &&
            (!requirement.name    || module.name    === requirement.name)
        )
    )
}

function getRequirements(requirementType, requirementName) {
    const requirementsRoot = getStore('assemblyRequirements')
    const group = requirementsRoot[requirementType]
    if (!group || !group[requirementName]) {
        throw new Error(`No requirements for ${requirementType}.${requirementName}`)
    }
    return group[requirementName]
}

function getMatchingModuleNames(requirements, availableModules) {
    return requirements.map((requirement) => {
        const candidates = availableModules.filter((module) => {
            if (module.type !== requirement.type) return false
            if (Object.prototype.hasOwnProperty.call(requirement, 'subtype') &&
                requirement.subtype !== undefined &&
                requirement.subtype !== null) {
                return module.subtype === requirement.subtype
            }
            return true
        })
        return {
            type: requirement.type,
            subtype: requirement.subtype,
            names: candidates.map((module) => module.name),
        }
    })
}

function canAssemblyMoveAlone(assembly) {
    if (!assembly || !Array.isArray(assembly.modules)) return false
    return assembly.modules.some((module) => module.type === 'transport')
}

// ---------- Map helpers ----------