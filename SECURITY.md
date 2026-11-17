# Security Policy

## Scope

This repository contains the source code of the **frontend** of the IVAO Belarus website.

## Supported Versions

Security fixes are released only for the latest version on the `main` branch and beta versions on the `dev` branch.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |
| `dev`   | ✅        |
| older   | ❌        |

## Reporting a Vulnerability

**Please do not open public issues or pull requests to report security vulnerabilities.**

You can reach us through:

1. **GitHub Private Vulnerability Reporting:** the *Security → Report a vulnerability* tab of this repository.
2. **Email:** `by-web@ivao.aero`.

Please include, where possible:

- a description of the issue and its potential impact;
- steps to reproduce or a proof of concept;
- affected pages, components, or versions;
- a suggested fix, if you have one.

## What to Expect

- Acknowledgement of your report within **10 business days**.
- Initial assessment and a plan of action within **20 days**.
- We will let you know when a fix is released and, if you wish, credit you in the acknowledgements.

> [!WARNING]
> We ask that you follow responsible disclosure: please do not publish details of the vulnerability until it has been fixed.

## Rules for Security Research

Allowed:

- reviewing the source code in this repository;
- testing on your own local copy (mock mode only).

Not allowed:

- attacking production infrastructure or the API (DoS, brute force, high-volume scanning);
- accessing, modifying, or disclosing other members' data;
- social engineering of members or division staff;
- any activity that violates IVAO rules.

If you accidentally gain access to personal data, stop your research immediately and let us know.

## Secrets and Credentials

This repository must not contain keys, tokens, or `client_secret` values. If you find something that looks like a secret, report it privately through the channels above. Please do not use it or publish it.

## Vulnerabilities in IVAO Services

Issues in IVAO's own infrastructure, APIs, or authentication (IVAO Login, etc.) should be reported directly to IVAO, not to us.

## Acknowledgements

We value the work of security researchers. We do not offer monetary rewards, but we are happy to credit your name or handle in an acknowledgements list.
