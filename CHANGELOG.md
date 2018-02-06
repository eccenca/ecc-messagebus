# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep A Changelog's Format](http://keepachangelog.com/).

## [5.0.0] 2018-02-06

### Changed
- *BREAKING*: updated to rxjs 5.0.0

### Removed

- *BREAKING*: createChannels experiment
- *BREAKING*: rxmq.js middleware capabilities, as we never really used them

## [3.6.0] 2016-06-24
### Added
- Added `rx@4.1.0` dependency, which is exported as `Rx`

### Changed
- Bumped dependencies of `rxmq` and `rxmq.middleware` to be compatible with `rx@4.1.0`

## [3.5.0] 2016-06-09
### Added
 - Implemented `createChannels` helper function which allows easier definition of Channels and Subjects
