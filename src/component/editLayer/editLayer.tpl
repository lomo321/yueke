<!--遮罩层-->
<div>
    <!--透明浮层-->
    <div v-bind:class="{ none: hideLayer, layer:true}" id="layer"></div>
    <!--新建题目-->
    <div v-bind:class="{ none: hideAddLayer, 'edit-layer':true, 'add-layer':true, 'anim-opacity2': !hideAddLayer}">
        <div class="top">
            添加题目
            <div class="icon-close" v-on:click="hideAdd">
                <img src="/images/close.png" alt="">
            </div>
        </div>
        <div class="edit-wrap">
            <div class="edit-panel">
                <div class="edit-row">
                    <!--<div class="edit-row">-->
                        <!--<strong>添加题目{{addModel.orderBy}}</strong>-->
                    <!--</div>-->
                    <div class="inline">
                        <span><i>*</i>题型</span>
                        <select v-model="addModel.qtypeInner" class="select">
                            <option value="">选择题型</option>
                            <option value="1">单选题</option>
                            <option value="2">多选题</option>
                            <option value="3">填空题</option>
                            <option value="4">简答题</option>
                        </select>
                    </div>
                    <div class="inline" v-if="addModel.qtypeInner == 1 || addModel.qtypeInner == 2">
                        <span><i>*</i>选项</span>
                        <select v-model="addModel.answerCount" class="select">
                            <template v-for="item,key in selectionArr">
                                <option :value="key">{{item}}</option>
                            </template>
                        </select>
                    </div>
                </div>
                <div class="edit-row">

                    <div class="inline">
                        <span><i>*</i>题号</span>
                        <input class="input" type="number" v-model="addModel.orderBy">
                    </div>
                    <div class="inline" >
                        <span>至</span>
                        <input class="input" type="number" v-model="addModel.endOrderBy" >
                    </div>
                </div>
                <div class="edit-save inline" v-on:click="comfirmAdd">确定</div>
                <!--<div class="edit-save inline">取消</div>-->
            </div>
        </div>
    </div>
    <!--编辑-->
    <div v-bind:class="{ none: hideEditLayer, 'edit-layer':true, 'anim-opacity2': !hideEditLayer}" id="editLayer">
        <div class="top">
            题目编辑
            <div class="icon-close" v-on:click="hideEdit">
                <img src="/images/close.png" alt="">
            </div>
        </div>
        <div class="edit-wrap">
            <div class="edit-panel">
                <div class="edit-row">
                    <strong>第{{editingStem.orderBy}}题</strong>
                </div>
                <div class="edit-row">
                    <div class="inline">
                        <span><i>*</i>题型</span>
                        <select v-model="editingStem.qtypeInner" class="select" v-on:change="editTypeChange">
                            <option value="null">选择题型</option>
                            <option value="1">单选题</option>
                            <option value="2">多选题</option>
                            <option value="3">填空题</option>
                            <option value="4">简答题</option>
                        </select>
                    </div>
                    <div class="inline options">
                        <span><i>*</i>选项</span>
                        <select v-model="editingStem.answerCount" class="select" v-on:change="selectNumChange">
                            <template v-for="item,key in selectionArr">
                                <option :value="key">{{item}}</option>
                            </template>
                        </select>
                    </div>
                </div>
                <div class="edit-row">
                    <span><i>*</i>难度</span>

                    <div v-if="editingStem.difficulty==0.8" class="difficulty" v-on:click="difficultyClick">
                        <div class="selected" data-difficulty="0.8">基础</div>
                        <div data-difficulty="0.5">巩固</div>
                        <div data-difficulty="0.3">提高</div>
                    </div>
                    <div v-else-if="editingStem.difficulty==0.5" class="difficulty" v-on:click="difficultyClick">
                        <div data-difficulty="0.8">基础</div>
                        <div class="selected" data-difficulty="0.5">巩固</div>
                        <div data-difficulty="0.3">提高</div>
                    </div>
                    <div v-else-if="editingStem.difficulty==0.3" class="difficulty" v-on:click="difficultyClick">
                        <div data-difficulty="0.8">基础</div>
                        <div data-difficulty="0.5">巩固</div>
                        <div class="selected" data-difficulty="0.3">提高</div>
                    </div>
                    <div v-else class="difficulty" v-on:click="difficultyClick">
                        <div data-difficulty="0.8">基础</div>
                        <div data-difficulty="0.5">巩固</div>
                        <div data-difficulty="0.3">提高</div>
                    </div>
                    <!--<span><i>&nbsp;</i>分值</span>-->
                    <!--<input class="input" type="text" v-model="editingStem.score">-->
                </div>
                <div class="edit-row">
                    <span><i>*</i>知识点</span>
                    <div class="knowledge">
                        <template v-for="(knp,index) in editingStem.knpList">
                            <div >{{knp.knpName}}<img src="/images/delete.png" style="float: right"  alt="" v-on:click="deleteKnp(index)"></div>
                        </template>
                        <div class="add-knp" style="padding-right: 10px">添加</div>
                    </div>
                </div>
                <div class="edit-row">
                    <span><i>*</i>题干</span>
                    <div class="uEditor-area">
                        <script id="container1" name="content" type="text/plain"></script>
                    </div>
                </div>

                <div class="edit-row choose-answer">
                    <span><i>*</i>答案</span>
                    <div class="answer" id="selectAnswer">
                    </div>
                </div>

                <div class="edit-row blank-answer">

                    <span>&nbsp&nbsp答案</span>
                    <div class="uEditor-area">
                        <script id="container2" name="content" type="text/plain"></script>
                    </div>
                    <div>
                        <span>高度</span>
                        <input class="input" type="text" v-model="editingStem.height">
                    </div>

                </div>

                <div class="edit-save" v-on:click="editSave">保存</div>
            </div>
        </div>
    </div>
    <!--知识点-->
    <div v-bind:class="{ none: hideKnpLayer, 'edit-layer':true, 'anim-opacity2': !hideKnpLayer, 'knp-layer' : true}" id="KnpLayer">
        <div class="top">
            添加知识点
            <div class="icon-close" v-on:click="hideKnp">
                <img src="/images/close.png" alt="">
            </div>
        </div>
        <div class="edit-wrap">
            <div class="edit-panel">
                <div class="selects">
                    <select class="select" v-model="knpFilter.edition" v-on:change="updateCourseBook">
                        <option value=" ">选择教材版本</option>
                        <option value="KX">开心版</option>
                        <option value="RJ">人教版</option>
                        <option value="BS">北师大版</option>
                        <option value="YW">语文版</option>
                        <option value="WY">外研版</option>
                        <option value="YH">粤沪版</option>
                        <option value="YJ">粤教版</option>
                        <option value="KY">科粤版</option>
                        <option value="ZT">中图版</option>
                        <option value="CJ">川教版</option>
                        <option value="XJ">湘教版</option>
                        <option value="YR">粤人民版</option>
                        <option value="QT">其他（包含总复习、专项类书籍，此类书籍无教材版本限制）</option>
                    </select>
                    <select class="select" v-model="knpFilter.cb" v-on:change="updateCourseBook">
                        <option value=" ">选择册别</option>
                        <option value="01">上册</option>
                        <option value="02">下册</option>
                        <option value="03">综合</option>
                        <option value="04">全一册</option>
                    </select>
                    <template v-if="courseBook && courseBook.length">
                        <select class="select" v-on:change="updateChapters" v-model="coursebookId">
                            <option value=" ">选择教材</option>
                            <option v-for="item in courseBook" :value="item.textbookId">{{item.name}}</option>
                        </select>
                    </template>
                </div>
                <div class="add-all">
                    <input style="margin-right:5px" type="checkbox" name="checkbox1" value="true" v-model="isAddAll"/><span style="color: #ff920b">其他题目同选一样的知识点</span> <span style="color: #c6c6c6">(还没选择知识点的题目)</span>
                </div>
                <div class="add-all">
                    <input style="margin-right:5px;width: 456px" type="text"  v-model="searchText"/>输入关键字搜索
                    <!--<div class="search-btn" v-on:click="searchKnp">搜索</div>-->
                </div>
                
                <div class="chapter" v-if="chapterListForRender">
                    <template v-for="item in chapterListForRender">
                            <div class="list level1" :data-id="item.id" v-bind:class="{fold: !item.unFold}">
                                <span class="level1">{{item.name}}</span>

                                <template v-for="item2 in item.son">
                                    <div class="list level2" :data-id="item2.id" v-bind:class="{fold: !item2.unFold}">
                                        <span class="level2">{{item2.name}}</span>

                                        <template v-for="item3 in item2.son">
                                            <div class="list level3" :data-id="item3.id" v-bind:class="{fold: !item3.unFold}">
                                                <span class="level3">{{item3.name}}</span>

                                                <template v-for="item4 in item3.son" >
                                                    <div class="list level4" :data-id="item4.id" v-bind:class="{fold: !item4.unFold}">
                                                        <span class="level4">{{item4.name}}</span>
                                                        <template v-for="knp4 in item4.knpList" >
                                                            <div class="knp-checkbox" v-bind:class="{selected: searchText && knp4.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp4)) > -1}">
                                                                <input type="checkbox" name="checkbox1" :value="JSON.stringify(knp4)" v-model="selectedKplList"/>{{knp4.knpName}}
                                                            </div>
                                                        </template>
                                                    </div>

                                                    
                                                </template>

                                                <template v-for="knp3 in item3.knpList">
                                                    <div class="knp-checkbox" v-bind:class="{selected: searchText && knp3.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp3)) > -1}">
                                                        <input type="checkbox" name="checkbox1" :value="JSON.stringify(knp3)" v-model="selectedKplList"/>{{knp3.knpName}}
                                                    </div>
                                                </template>

                                            </div>
                                        </template>

                                        <template v-for="knp2 in item2.knpList">
                                            <div class="knp-checkbox" v-bind:class="{selected: searchText && knp2.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp2)) > -1}">
                                                <input type="checkbox" name="checkbox1" :value="JSON.stringify(knp2)" v-model="selectedKplList"/>{{knp2.knpName}}
                                            </div>
                                        </template>

                                    </div>
                                </template>

                                <template v-for="knp in item.knpList" >
                                    <div class="knp-checkbox" v-bind:class="{selected: searchText && knp.knpName.indexOf(searchText) > -1 , chosen: selectedKplList.indexOf(JSON.stringify(knp)) > -1}">
                                        <input type="checkbox" name="checkbox1" :value="JSON.stringify(knp)" v-model="selectedKplList"/>{{knp.knpName}}
                                    </div>
                                </template>
                            </div>
                    </template>
                </div>
                <div class="no-knp" v-else >暂无知识点，请重新选择教材！</div>

            </div>
            <div  class="save-wrapper">
                <div class="edit-save" v-on:click="knpSave">保存</div>
            </div>

        </div>

    </div>
    <!--添加上方文本-->
    <div v-bind:class="{ none: hideAddShareLayer, 'edit-layer':true, 'anim-opacity2': !hideAddShareLayer}" id="addShareLayer">
        <div class="top">
            编辑上方文本
            <div class="icon-close" v-on:click="hideAddShare">
                <img src="/images/close.png" alt="">
            </div>
        </div>
        <div class="edit-wrap">
            <div class="edit-panel">
                <div class="edit-row">
                    <div class="uEditor-area">
                        <script id="container3" name="content" type="text/plain"></script>
                    </div>
                </div>
                <div class="edit-save" v-on:click="addShareSave">保存</div>
            </div>
        </div>

    </div>
</div>