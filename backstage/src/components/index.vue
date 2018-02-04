<template>
	<div class="baseContainer">
		<el-row>
			<el-card class="box-card" v-if="hideTip">
				<div slot="header" class="clearfix">
					<span>系统使用介绍</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="hideTip = false">关闭</el-button>
				</div>
				<div v-for="o in 4" :key="o" class="text item">
					{{'列表内容 ' + o }}
				</div>
			</el-card>
		</el-row>
		<el-row>
			<div class="container">
				<h2 class="line">游戏信息</h2>
				<el-col :span="12">
					<span>名称:</span>
					<span>皇冠4D彩票</span>
				</el-col>
				<el-col :span="12" class="text-right">
					<span>当前期数:</span>
					<span>12344</span>
				</el-col>
			</div>
			
		</el-row>
		<el-row>
			<div class="container">
				<el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="时间" prop="time">
						<el-date-picker
							v-model="ruleForm.date"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions2">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="" prop="time">
						<el-button type="primary" @click="search()">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-col :span="12">
					<h3>当前状态: <span>{{status}}</span> </h3>
				</el-col>
				<el-col :span="12" class="text-center">
					<el-button type="primary" @click="gameSetting">游戏设置</el-button>
					<el-button type="primary" @click="liveConf">直播开奖</el-button>
					<el-button type="primary" @click="showCustomize">自定义开奖</el-button>
				</el-col>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-table
					v-loading="loading"
					:data="tableData"
					stripe
					style="width: 100%">
					<el-table-column
						align="center"
						prop="period"
						label="期数">
					</el-table-column>
					<el-table-column
						align="center"
						prop="date"
						:formatter="formatDate"
						label="开奖时间">
					</el-table-column>
					<el-table-column
						align="center"
						prop="first"
						label="头奖">
					</el-table-column>
					<el-table-column
						align="center"
						prop="second"
						label="二奖">
					</el-table-column>
					<el-table-column
						align="center"
						prop="third"
						label="三奖">
					</el-table-column>
					<el-table-column
						align="center"
						width="450"
						prop="special"
						:formatter="formatNumber"
						label="特别奖">
					</el-table-column>
					<el-table-column
						align="center"
						width="450"
						prop="comfort"
						:formatter="formatNumber"
						label="安慰奖">
					</el-table-column>
					<el-table-column
						align="center"
						
						label="操作">
						<template slot-scope="scope">
							<el-button type="text">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="container text-center">
					<el-pagination
						background
						layout="prev, pager, next"
						:total="total" :page-size="pageCount"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage">
					</el-pagination>
				</div>
				
			</div>
		</el-row>
		<el-dialog
			title="游戏设置"
			:visible.sync="settingVisible"
			width="30%">
			<el-form :model="settingForm" :rules="settingRules" ref="settingForm" label-width="100px" class="demo-settingForm">
				<el-form-item label="开奖模式" prop="type">
					<el-select v-model="settingForm.type" placeholder="请选择活动区域">
						<el-option label="系统开奖" value="1"></el-option>
						<el-option label="自定义开奖" value="2"></el-option>
						<el-option label="直播开奖" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开采状态" prop="status">
					<el-radio v-model="settingForm.status" label="1">开采</el-radio>
  					<el-radio v-model="settingForm.status" label="0">暂停</el-radio>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="settingVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmSetting">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="自定义开奖设置"
			:visible.sync="customizeDialog"
			width="60%">
			<el-form v-loading="customizeLoading" :model="customizeForm" :rules="customizes" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="期数" prop="date">
					<span>{{customizeForm.date}}</span>
				</el-form-item>
				<el-form-item label="首奖" prop="firstPrise.number">
					<el-input v-model="customizeForm.firstPrise.number"></el-input>
				</el-form-item>
				<el-form-item label="二奖" prop="secondPrise.number">
					<el-input v-model="customizeForm.secondPrise.number"></el-input>
				</el-form-item>
				<el-form-item label="三奖" prop="thirdPrise.number">
					<el-input v-model="customizeForm.thirdPrise.number"></el-input>
				</el-form-item>
				<el-form-item label="特别奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item,index) in customizeForm.speciallyPrise" :key="item._id" @click="change('special',index,item)">{{item.number}}</el-button>
						<el-button type="primary" v-if="customizeForm.speciallyPrise.length <= 12" @click="add('special')">添加</el-button>
					</div>
				</el-form-item>
				<el-form-item label="安慰奖">
					<div class="prizeContainer">
						<el-button type="text" v-for="(item,index) in customizeForm.comfortPrise" :key="item._id" @click="change('comfort',index,item)">{{item.number}}</el-button>
						<el-button type="primary" v-if="customizeForm.comfortPrise.length <= 9" @click="add('comfort')">添加</el-button>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="customizeDialog = false">取 消</el-button>
				<el-button type="primary" @click="confirmCustomize">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data(){
		return {
			hideTip:true,
			ruleForm:{},
			rules:{},
			value7:"",
			pickerOptions2: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
			currentPage:1,
			total:1,
			pageCount:10,
			loading:true,
			tableData: [],
			customizeDialog:false,
			customizeLoading:false,
			// 自定义
			customizeForm:{
				date:new Date().toLocaleDateString().replace("/","-"),
				firstPrise:{},
				secondPrise:{},
				thirdPrise:{},
				speciallyPrise:[],
				comfortPrise:[]
			},
			customizes:{},
			// 系统配置
			conf:{},
			settingVisible:false,
			// 游戏设置
			gameSettingInfo:{},
			settingForm:{},
			settingRules:{

			},
		}
	},
	created(){
		this.$message.info("正在加载系统配置，请稍后");
		this.checkoutLogin();
		this.getConf();
		this.search();
	},
	computed:{
		status(){
			let status = {
				"0":"暂停开采",
				"1":"正在开采"
			}
			return status[this.conf.status] || "";
		}
	},
	methods:{
		// 格式化日期
		formatDate(row,col){
			return new Date(row.date).toLocaleDateString();
		},
		// 格式化数据
		formatNumber(row,col){
			return row[col.property].join(",");
		},
		// 加载数据
		search(page){
			let self = this;
			self.loading = true;
			let data = {
				pageId:1,
				pageCount:self.pageCount,
				startDate:new Date(new Date()-604800000).toLocaleDateString().replace(/\//g,"-"),
				endDate:new Date().toLocaleDateString().replace(/\//g,"-")
			};
			if(self.ruleForm.date && self.ruleForm.date.length != 0){
				data.startDate = new Date(self.ruleForm.date[0]).toLocaleDateString().replace(/\//g,"-")
				data.endDate = new Date(self.ruleForm.date[1]).toLocaleDateString().replace(/\//g,"-")
			}
			if(page){
				data.pageId = page.pageId
			}
			self.$axios.post(self.$interfaces.list,data).then((res)=>{
				self.loading = false;
				if(res.data.status == 200){
					self.tableData = res.data.data;
					self.currentPage = res.data.pageId;
					self.total = res.data.total;
				}
			});;
		},
		// 切换分页
		handleCurrentChange(value){
			this.search({pageId:value});
			
		},
		// 检测登录状态
		checkoutLogin(){
			let self = this;
			self.$axios.get(self.$interfaces.check).then(res=>{
				console.log(res.data);
				
			});
		},
		// 获取配置信息
		getConf(){
			let self = this;
			self.$axios.get(self.$interfaces.setting).then(res=>{
				if(res.data.status == 200){
					self.conf = res.data.data;
					self.$message({
						message:"加载成功",
						type:"success"
					});
				}else{
					self.$message({
						message:"系统设置加载失败，请确认服务是否正常",
						type:"error"
					});
				}
			});
		},
		getList(){
			let self = this;
			
		},
		// 游戏设置
		gameSetting(){
			let self = this;
			self.settingVisible = true;
		},
		// 提交游戏设置
		confirmSetting(){
			let self = this;
			
		},
		// 直播设置
		liveConf(){
			let self = this;
			if(self.conf.type != 3){
				self.$message.error("当前系统设置非直播开奖模式，请先修改系统设置");
				return false;
			}
		},
		// 自定义设置
		showCustomize(){
			let self = this;
			if(self.conf.type != 2){
				self.$message.error("当前系统设置非自定义开奖模式，请先修改系统设置");
				return false;
			}
			self.customizeDialog = true;
			self.customizeLoading = true;
			self.$axios.post(self.$interfaces.list,{pageId:1,pageCount:1}).then(res=>{
				self.customizeLoading = false;
				if(res.data.status == 200){
					self.customizeForm = res.data.data[0];
					
				}else{
					self.$message({
						message:res.data.msg,
						type:"error"
					});
				}
			});
		},
		// 添加自定义
		add(type){
			if(type == 'special'){
				if(customizeForm.length <= 13){
					customizeForm.push({number:'请点击输入',date:new Date()});
				}
			}
				
			
		},
		// 修改自定义
		change(type,index,obj){
			if(type == 'special'){

			}
		},
		// 确认提交
		confirmCustomize(){

		}
	}
}
</script>