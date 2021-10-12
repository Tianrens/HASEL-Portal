import React from 'react';

export const discardResourceMessage = (resource) => (
    <p>Are you sure you want to discard your changes to this {resource}?</p>
);
export const editResourceMessage = (resource) => (
    <p>Are you sure you want to confirm your changes to this {resource}?</p>
);
export const deleteMessage = (resource) => <p>Are you sure you want to delete this {resource}?</p>;
export const createResourceMessage = (resource) => (
    <p>Are you sure you want to save your changes and create this {resource}?</p>
);

export const deleteRequestMessage = (
    <p>
        Are you sure you want to delete this workstation request?
        <br />
        <br /> This will also remove the user account from the Workstation if applicable.
    </p>
);
export const denyRequestMessage = (
    <p>
        Are you sure you want to deny this workstation request?
        <br />
        <br />
        The user will also be sent an email letting them know their request has been denied.
    </p>
);
export const acceptRequestMessage = (
    <p>
        Are you sure you want to accept this workstation request?
        <br />
        <br />
        This will also make changes as necessary to the allocated workstation.
        <br />
        The user will also be sent an email with details regarding their workstation account.
    </p>
);

export const editRequestMessage = (
    <p>
        Are you sure you want to confirm your changes to this workstation request?
        <br />
        <br />
        This will also make changes as necessary to the user and their allocated workstation.
        <br />
        The user will also be sent an email with updated details regarding their workstation account.
    </p>
);
export const createWorkstationMessage = (
    <p>
        Are you sure you want to create this workstation?
        <br /> <br />
        <strong>NOTE:</strong> You will also need to add the <strong>hasel-users</strong> usergroup
        manually.
    </p>
);
