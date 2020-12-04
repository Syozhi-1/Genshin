var kachi = {};

	$(function() {
		$.ajax({
			type: "get",
			url: "data/limit.json",
			dataType: 'json',
			success: function(rs) {
				kachi = rs;
				if(kachi.hasOwnProperty("up")) {
					var r4 = kachi.up["r4"]["1"].toString();
					var r5 = kachi.up["r5"]["1"].toString();
					$("#currUp").html("5★：" + r5 + "&nbsp;&nbsp;&nbsp;&nbsp;4★：" + r4);
				} else {
					$("#currUp").html("无UP");
				}

			}
		});
	});

	var vue = new Vue({
		el: "#app",
		data: {
			count: 0, // 总抽奖次数
			s5_count: 0, // 抽出的5星次数
			s4_count: 0, // 抽出的4星次数
			s3_count: 0, // 抽出的3星次数
			s4_baodi: 0, // 4星保底计数器
			s5_baodi: 0, // 5星保底计数器
			da_baodi: 90 // 大保底剩余次数
		},
		methods: {
			single: function() {

				var c = Math.random();
				var p = 3;
				if(c <= 0.006) {
					p = 5;
				} else if(c > 0.006 && c <= 0.051) {
					p = 4;
				} else {
					p = 3;
				}

				if(this.count > 0 && this.da_baodi == 1) { // 90发大保底判定
					p = 5;
					this.s5_baodi++;
				} else if(this.count > 0 && ((this.count + 1) % 10 == 0)) { // 10发保底判定
					p = 4;
					this.s4_baodi++;
				}

				var up = "否";

				switch(p) {
					// 3星
					case 3:
						this.da_baodi--;
						var chi = kachi.r3["0"];
						up = "否";
						var len = chi.length - 1;
						var huo = kachi.r3["0"][Math.round(Math.random() * len)];

						$("#sum").after("<tr><td>" + (this.count + 1) + "</td><td>3★</td><td>" + huo + "</td><td>" + up + "</td><td>" + c + "</td></tr>");
						this.s3_count++;
						this.count++;
						break;
						// 4星
					case 4:
						this.da_baodi--;
						// 根据w的值判断抽到的4星是武器还是角色， 0为武器，1为角色
						var w = Math.round(Math.random());
						var chi = kachi.r4[w];
						var len = chi.length - 1;
						var huo = kachi.r4[w][Math.round(Math.random() * len)];
						up = "否";

						// 判断是否抽中up角色
						if(Math.random() <= 0.5 && kachi.hasOwnProperty("up")) { // up
							chi = kachi.up["r4"]["1"]; // 抽奖改为只抽up
							len = chi.length - 1;
							huo = chi[Math.round(Math.random() * len)];
							up = "是";
						}

						$("#sum").after("<tr class='zhi'><td>" + (this.count + 1) + "</td><td>4★</td><td>" + huo + "</td><td>" + up + "</td><td>" + c + "</td></tr>");
						$("#r4_d").after("<tr><td>" + (this.count + 1) + "</td><td>4★</td><td>" + huo + "</td>");
						this.s4_count++;
						this.count++;

						break;
						// 5星
					default:
						this.da_baodi = 90; //重置大保底
						var chi = kachi.r5["1"];
						var len = chi.length - 1;
						var huo = kachi.r5["1"][Math.round(Math.random() * len)];
						up = "否";

						// 判断是否抽中up角色
						if(Math.random() <= 0.5 && kachi.hasOwnProperty("up")) { // up
							chi = kachi.up["r5"]["1"]; // 抽奖改为只抽up
							len = chi.length - 1;
							if(len == 0) {
								huo = chi[len];
							} else {
								huo = chi[Math.round(Math.random() * len)];
							}
							up = "是";
						}

						$("#sum").after("<tr class='jin'><td>" + (this.count + 1) + "</td><td>5★</td><td>" + huo + "</td><td>" + up + "</td><td>" + c + "</td></tr>");
						$("#r5_d").after("<tr><td>" + (this.count + 1) + "</td><td>5★</td><td>" + huo + "</td>");
						this.s5_count++;
						this.count++;
						break;
				}
			},
			ten: function() {
				for(var i = 0; i < 10; i++) {
					this.single();
				}
			}
		}
	})