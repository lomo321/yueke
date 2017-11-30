<div>

    <!--步骤栏-->
    <div class="top-bar">
        <div class="box">第1步：新建作业</div>
        <div class="arrow current"></div>

        <div class="box current">第2步：作业编辑</div>
        <div class="arrow "></div>

        <div class="box ">第3步：作业预览</div>
        <div class="arrow current"></div>

        <div class="box ">第4步：生成作业</div>
    </div>
    <!--有问题的题目-->
    <div class="problem-bar" v-if="errorData && errorData.length">
        <table>
            <tr>
                <th>题号</th>
                <th>问题</th>
                <th>解决建议</th>
                <th>调整</th>
            </tr>
            <template v-for="item in errorData">
                <tr>
                    <td>第{{item.orderBy}}题</td>
                    <td>{{item.errMgs}}</td>
                    <td>{{item.suggest}}</td>
                    <td class="fix" v-on:click="callfix(item.orderBy)">调整</td>
                </tr>
            </template>
        </table>
    </div>
    <!--添加新题-->
    <div class="create-bar" id="create-bar">
        <div>
            <span>添加题目</span>
            <div class="button" data-type="1">+ 单选题</div>
            <div class="button" data-type="2">+ 多选题</div>
            <div class="button" data-type="3">+ 填空题</div>
            <div class="button" data-type="4">+ 简答题</div>

            <div class="to-top">返回顶部</div>
            <div class="reFormat" v-on:click="reFormat">调整排版</div>

            <div class="mark-wrap">
                <input style="margin-right:5px" type="checkbox" name="checkbox1" value="true" v-model="isShowMarks"/>添加分数（试卷总分：{{totalMark}}）
            </div>
        </div>
    </div>

    <!--编辑题目区域-->
    <div class="main-area">
        <!--题目区-->
        <div class="test-paper">
            <div class="page-Wrap edit-page">
                <div class="page none" id="hiddenPage">
                    <div class="head">
                        <div class="title">{{bookInfo.name}}</div>
                        <div class="information">
                            班级___________&nbsp&nbsp&nbsp&nbsp&nbsp
                            姓名___________&nbsp&nbsp&nbsp&nbsp&nbsp
                            学号___________
                        </div>
                        <div class="detail">
                            【客观题填涂的正确方法】<br>
                            • 请使用用2B铅笔填涂；修改时用橡皮擦擦干净；<br>
                            • 填涂的正确方法是：<br>
                            【主观题填涂的正确方法】<br>
                            • 请在答题方框内作答，超出将视为无效答案内容
                            <div class="QRCode">二维码</div>
                            <div class="example-block">
                                <div class="block"></div>
                                <div class="block white"></div>
                                <div class="block white"></div>
                                <div class="block white"></div>
                            </div>
                        </div>
                    </div>
                    <div class="answer">
                        <div class="block top-left"></div>
                        <div class="block top-right"></div>
                        <div class="block bottom-left"></div>

                        <div class="fillArea" v-if="qListForRender && qListForRender.length">
                            <template v-for="item in qListForRender">
                                <div class="fillArea-answer answerarea" v-if="item.qtypeInner == 1 || item.qtypeInner == 2"
                                     :data-qid="item.questionId" :data-order="item.orderBy" :data-type="item.qtypeInner">
                                    <span>{{item.orderBy}}</span>
                                    <div class="fillArea-block answerblock" v-for="selection in item.answerCountArray">
                                        {{selection}}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="stem-area" v-if="qListForRender && qListForRender.length">
                        <template v-for="item in qListForRender">
                            <div class="stem" :data-qid="item.questionId" :data-qtype="item.qtypeInner"
                                 :data-order="item.orderBy">
                                <div class="share-stem" v-if="item.shareStem" v-html="item.shareStem"></div>
                                <div class="orderBy">
                                    第{{item.orderBy}}题
                                    <div v-if="item.qtypeInner==1" class="qtypeInner">单选题</div>
                                    <div v-if="item.qtypeInner==2" class="qtypeInner">多选题</div>
                                    <div v-if="item.qtypeInner==3" class="qtypeInner">填空题</div>
                                    <div v-if="item.qtypeInner==4" class="qtypeInner">简答题</div>

                                    <div v-if="item.score && isShowMarks" class="score">（{{item.score}}分）</div>
                                </div>
                                <template v-if="bookInfo.cardFormat != 1"><!--答题卡-->
                                    <section></section>
                                </template>
                                <template v-if="bookInfo.cardFormat == 1"><!--非答题卡-->
                                    <section v-html="item.stem"></section>
                                </template>
                                <div class="answer-area" v-if="item.qtypeInner != 1 && item.qtypeInner != 2" v-bind:style="{height: item.height + 'px'}">
                                    我的作答
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <!--编辑区-->
        <div class="edit-area">
            <template v-for="(item, index) in editData">
                <edit-tag :orderBy="index+1" v-on:knpLinkClick="callKnp(index+1)"
                          v-on:editLinkClick="callfix(index+1)" v-bind:isShowMarks="isShowMarks"></edit-tag>
            </template>
            <div class="edit-add" v-on:click="addQuestion">
                添加新题
            </div>
        </div>
        <!--选中浮层-->
        <div class="hover-layer none">
            <div class="hover-btns">
                <div class="hover-edit">编辑题目</div>
                <div class="hover-insert">插入题目</div>
                <div class="hover-delete">删除题目</div>
                <div class="hover-text">编辑上方文本</div>
                <div class="hover-remove">删除上方文本</div>
                <div class="hover-up">上移</div>
                <div class="hover-down">下移</div>
            </div>
        </div>
        <!--编辑题目-->
        <div class="title-edit none">
            <input type="text" v-model="bookInfo.name">
        </div>
    </div>

    <div class="preview-bar">
        <div class="preview-btn" v-on:click="toPreview">作业预览</div>
    </div>

    <loading-layer></loading-layer>
    <edit-layer></edit-layer>
</div>
