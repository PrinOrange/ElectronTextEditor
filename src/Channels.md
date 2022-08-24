

# Channels

<!-- TOC -->

- [Channels](#channels)
  - [Describe](#describe)
  - [Channels Design Standard](#channels-design-standard)
  - [Channels Document](#channels-document)
    - [open-file](#open-file)
    - [save-file](#save-file)
      - [Form](#form)
      - [References](#references)
    - [fetch-code](#fetch-code)
    - [set-codemap](#set-codemap)
    - [set-autowrap](#set-autowrap)

<!-- /TOC -->

## Describe

This document is used to record the information of the listener, and give the specific location, usage and parameter explanation. Used to quickly sort through the communication models in this program.


## Channels Design Standard

+ **No Repeat Listening** Repeated listening of the same channel will not only degrade Electron's performance. And for non-idempotent operations, repeated listening may also cause unexpected bugs. **Note here: listening behaviors are side effects in React. Pay attention to the repeated listening problem that may be caused by the refresh rendering of React components.**
+ **Unique channel names** This is not only to avoid repeated listening, but also an important use for dividing responsibilities
+ **Remove unused listeners timely** Timely removal of unnecessary listeners can improve execution performance and reduce consumption of system resources
+ **If unnecessary, do not set listening** Please only set up listeners for operations that involve the rendering process operating native system functions.

## Channels Document

### open-file

### save-file

#### Form

#### References

### fetch-code


### set-codemap


### set-autowrap
