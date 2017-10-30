#!/usr/bin/env bash

set -u -e -o pipefail

export PYTHONIOENCODING=utf8;

##################
# Get value in json string given key.
# Arguments:
#   param1 - json string
#   param2 - key in json
# Returns:
#   string
##################
jsonExtractValue() {
    cat $1 | python -c "import sys, json; print json.load(sys.stdin)['${2}']";
}

##################
# Run yarn command on all node modules.
# Arguments:
#   param1 - yarn command
#   param2 - text to show
#   param3 - absolute path to the directory containing package.json
# Returns:
#   None
##################
scripts() {
    pushd $3 > /dev/null;
    packageName=$(jsonExtractValue './package.json' 'name');
    echo "=== $2 ${packageName}"
    yarn $1 > /dev/null || true;
    for package in packages/* ; do
        if [[ -d "$(pwd)/${package}" && -f "$(pwd)/${package}/package.json" ]]; then
            scripts $1 $2 "$(pwd)/${package}"
            popd > /dev/null;
        fi
    done
}

##################
# Run yarn install on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
install() {
    scripts 'install' 'Installing' $1;
}

##################
# Run yarn build on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
build() {
    scripts 'build' 'Building' $1;
}

##################
# Run yarn clean on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
clean() {
    scripts 'clean' 'Cleaning' $1;
}

clean $(pwd);
install $(pwd);
build $(pwd);