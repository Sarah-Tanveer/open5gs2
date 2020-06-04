/*
 * lmf_info.h
 *
 *
 */

#ifndef _OpenAPI_lmf_info_H_
#define _OpenAPI_lmf_info_H_

#include <string.h>
#include "../external/cJSON.h"
#include "../include/list.h"
#include "../include/keyValuePair.h"
#include "../include/binary.h"
#include "access_type.h"
#include "an_node_type.h"
#include "external_client_type.h"
#include "rat_type.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef struct OpenAPI_lmf_info_s OpenAPI_lmf_info_t;
typedef struct OpenAPI_lmf_info_s {
    OpenAPI_list_t *serving_client_types;
    char *lmf_id;
    OpenAPI_list_t *serving_access_types;
    OpenAPI_list_t *serving_an_node_types;
    OpenAPI_list_t *serving_rat_types;
} OpenAPI_lmf_info_t;

OpenAPI_lmf_info_t *OpenAPI_lmf_info_create(
    OpenAPI_list_t *serving_client_types,
    char *lmf_id,
    OpenAPI_list_t *serving_access_types,
    OpenAPI_list_t *serving_an_node_types,
    OpenAPI_list_t *serving_rat_types
    );
void OpenAPI_lmf_info_free(OpenAPI_lmf_info_t *lmf_info);
OpenAPI_lmf_info_t *OpenAPI_lmf_info_parseFromJSON(cJSON *lmf_infoJSON);
cJSON *OpenAPI_lmf_info_convertToJSON(OpenAPI_lmf_info_t *lmf_info);

#ifdef __cplusplus
}
#endif

#endif /* _OpenAPI_lmf_info_H_ */
