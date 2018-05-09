#!/bin/bash

LANGS=("en" "de")

for (( i=0; i<${#LANGS[@]}; i++ ))
do
    echo
    echo "Language: ${LANGS[$i]}"
    echo

    echo 'Extracting global translations...'
    ngx-translate-extract -m _ --fi "  " --input ./apps/cme-ui/src ./libs/shared/src --output ./libs/i18n/src/assets/${LANGS[$i]}.json --sort --format namespaced-json

    echo 'Extracting solution-view translations...'
    ngx-translate-extract -m _ --fi "  " --input ./libs/solution-view/src --output ./libs/solution-view/src/i18n/${LANGS[$i]}.json --sort --format namespaced-json

    echo 'Extracting cost-view translations...'
    ngx-translate-extract -m _ --fi "  " --input ./libs/cost-view/src --output ./libs/cost-view/src/i18n/${LANGS[$i]}.json --sort --format namespaced-json

    echo 'Extracting quality-view translations...'
    ngx-translate-extract -m _ --fi "  " --input ./libs/quality-view/src --output ./libs/quality-view/src/i18n/${LANGS[$i]}.json --sort --format namespaced-json

    echo 'Extracting domain-model-view translations...'
    ngx-translate-extract -m _ --fi "  " --input ./libs/domain-model-view/src --output ./libs/domain-model-view/src/i18n/${LANGS[$i]}.json --sort --format namespaced-json

done
