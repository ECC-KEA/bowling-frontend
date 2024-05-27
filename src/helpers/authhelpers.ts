import {UserResource} from "@clerk/types";

const getOrganization = (user:UserResource|null|undefined) => {
    if (user) {
        return user.organizationMemberships.find(
            (org) => org.organization.name === 'operations' || org.organization.name === 'management'
        )?.organization.name;
    }
    return null;
};

export {getOrganization};